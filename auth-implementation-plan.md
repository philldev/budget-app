# Auth Implementation Plan: OpenAuth + Next.js + Turso + Drizzle ORM

This plan outlines the integration of [OpenAuth](https://openauth.js.org/) into a Next.js application using Turso (libSQL) as the database backend, managed via **Drizzle ORM**.

## 1. Architecture Overview

*   **Framework**: Next.js (App Router).
*   **Auth Library**: `openauth` (Self-hosted Auth Server running within Next.js).
*   **Database**: Turso (SQLite) via `@libsql/client`.
*   **ORM**: Drizzle ORM for type-safe database interactions and schema management.
*   **Strategy**:
    1.  **Auth Server**: Host the OpenAuth issuer as a Next.js API route (`/api/auth/[...slug]`).
    2.  **Storage Adapter**: Implement a custom Storage Adapter for OpenAuth using Drizzle to persist auth state (sessions, codes) in Turso.
    3.  **Application Data**: Link the OpenAuth `subjectID` to a local `users` table in Turso to manage application-specific data (like Todo lists).

## 2. Prerequisites

### Environment Variables
Ensure the following are set in `.env.local`:

```bash
# Turso / LibSQL
TURSO_DATABASE_URL="libsql://your-db.turso.io"
TURSO_AUTH_TOKEN="your-turso-token"

# OpenAuth Configuration
OPENAUTH_ISSUER="http://localhost:3000/api/auth" # The URL of your auth server
OPENAUTH_SECRET="a-secure-random-32-byte-string"

# OAuth Providers (Example: Google)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

### Dependencies
Run the following install command:

```bash
npm install openauth @openauth/nextjs @openauth/providers @libsql/client drizzle-orm zod
npm install -D drizzle-kit
```

## 3. Database Schema (Drizzle)

We will define the schema using Drizzle.

**File:** `lib/schema.ts`

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 3.1. OpenAuth Internal Storage (KV Store)
export const authKeyValue = sqliteTable("auth_key_value", {
  key: text("key").primaryKey(),
  value: text("value"), // JSON payload
  expiresAt: integer("expires_at", { mode: "number" }), // Timestamp in ms
});

// 3.2. Application Users
export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // The OpenAuth Subject ID
  email: text("email"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});
```

### 3.3. Drizzle Config
**File:** `drizzle.config.ts`

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
```

## 4. Implementation Steps

### Step 1: Create the Drizzle Client
**File:** `lib/db.ts`

```typescript
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });
```

### Step 2: Implement OpenAuth Storage Adapter
Wrap Drizzle to act as the KV store for OpenAuth.

**File:** `lib/auth/storage.ts`

```typescript
import { StorageAdapter } from "openauth/storage/storage";
import { db } from "../db";
import { authKeyValue } from "../schema";
import { eq, and, or, isNull, gt } from "drizzle-orm";

export const TursoStorage: StorageAdapter = {
  async get(key: string[]) {
    const k = key.join(":");
    const now = Date.now();
    
    const result = await db
      .select({ value: authKeyValue.value })
      .from(authKeyValue)
      .where(
        and(
          eq(authKeyValue.key, k),
          or(isNull(authKeyValue.expiresAt), gt(authKeyValue.expiresAt, now))
        )
      )
      .limit(1);

    if (result.length === 0 || !result[0].value) return undefined;
    return JSON.parse(result[0].value);
  },

  async set(key: string[], value: any, ttl?: number) {
    const k = key.join(":");
    const expiresAt = ttl ? Date.now() + ttl * 1000 : null;

    await db
      .insert(authKeyValue)
      .values({ key: k, value: JSON.stringify(value), expiresAt })
      .onConflictDoUpdate({
        target: authKeyValue.key,
        set: { value: JSON.stringify(value), expiresAt },
      });
  },

  async remove(key: string[]) {
    const k = key.join(":");
    await db.delete(authKeyValue).where(eq(authKeyValue.key, k));
  },

  async scan(prefix: string[]) {
    // Optional: Implement for cleanup tasks if necessary
    return (async function* () { yield []; })(); 
  }
};
```

### Step 3: Create the Auth Server (Issuer)
**File:** `app/api/auth/[[...slug]]/route.ts`

```typescript
import { issuer } from "@openauth/nextjs";
import { GoogleProvider } from "@openauth/providers/google";
import { TursoStorage } from "@/lib/auth/storage";

export const { GET, POST } = issuer({
  storage: TursoStorage,
  providers: {
    google: GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scopes: ["email", "profile"],
    }),
  },
  // On successful login, define the Subject ID
  success: async (ctx, value) => {
    if (value.provider === "google") {
      return ctx.subject("user", {
        id: value.tokens.id, // Or value.tokens.sub
        email: value.tokens.email
      });
    }
    throw new Error("Unknown provider");
  },
});
```

### Step 4: Create the Auth Client Helper
**File:** `lib/auth/client.ts`

```typescript
import { createClient } from "@openauth/nextjs/client";

export const client = createClient({
  clientID: "nextjs-client",
  issuer: process.env.OPENAUTH_ISSUER!,
});
```

### Step 5: Protect Routes & Middleware
**File:** `middleware.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/auth/client";

export async function middleware(req: NextRequest) {
  const token = await client.getToken(req);
  
  // If no token and trying to access protected routes
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

### Step 6: Sync User on Login (Callback Handling)
When OpenAuth redirects back, ensure the user exists in our `users` table.

**File:** `app/dashboard/page.tsx` (Protected Page)

```typescript
import { client } from "@/lib/auth/client";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  // 1. Verify Token
  const subject = await client.verify(await client.getToken());
  if (!subject) return redirect("/");

  // 2. Sync User to Turso (Idempotent)
  await db
    .insert(users)
    .values({ id: subject.properties.id, email: subject.properties.email })
    .onConflictDoNothing();

  return (
    <div>
      <h1>Welcome, {subject.properties.email}</h1>
    </div>
  );
}
```

## 5. Next Steps

1.  **Generate Migration**: Run `npx drizzle-kit generate` to create the SQL migration file.
2.  **Push Schema**: Run `npx drizzle-kit push` (or `migrate`) to apply the schema to Turso.
3.  **Code Implementation**: Create the files listed in Section 4.
4.  **Testing**:
    *   Navigate to `/`.
    *   Click Login.
    *   Verify redirection to Google and back.
    *   Check Turso `users` table via Drizzle Studio or CLI.
