# Plan: Better-Auth Implementation

This plan outlines the steps to implement Better-Auth into the Budget App using the existing Drizzle ORM and Turso database.

## 1. Dependencies
Install the required packages:
```bash
bun add better-auth
```

## 2. Google OAuth Setup
Before implementing the code, you need to configure your Google Cloud project:

1.  **Create a Project:** Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new project.
2.  **Configure Consent Screen:**
    - Navigate to **APIs & Services > OAuth consent screen**.
    - Choose **External** (unless you have a Workspace organization).
    - Fill in the required app information (App name, user support email, etc.).
    - Add the `.../auth/userinfo.email` and `.../auth/userinfo.profile` scopes.
3.  **Create Credentials:**
    - Go to **APIs & Services > Credentials**.
    - Click **Create Credentials > OAuth client ID**.
    - Select **Web application** as the Application type.
    - **Authorized JavaScript origins:** `http://localhost:3000` (and your production domain later).
    - **Authorized redirect URIs:** `http://localhost:3000/api/auth/callback/google` (Better-Auth standard path).
4.  **Copy Secret Keys:** Copy the **Client ID** and **Client Secret** into your `.env` file.

## 3. Schema Integration
Add the following tables to `lib/db/schema.ts` to support Better-Auth's core functionality.

### `lib/db/schema.ts`
```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});
```

## 3. Auth Server Configuration
Configure the Better-Auth server instance.

### `lib/auth.ts`
```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [nextCookies()],
});
```

## 4. Catch-all API Route
Handle all authentication requests.

### `app/api/auth/[...all]/route.ts`
```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

## 5. Auth Client
Create the client-side instance for React components.

### `lib/auth-client.ts`
```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

// Example Usage:
// await authClient.signIn.social({ provider: "google" });
```

## 6. CLI Commands
Synchronize the database schema with Turso:

1. **Generate migration files:**
   ```bash
   bunx drizzle-kit generate
   ```
2. **Apply changes to the database:**
   ```bash
   bunx drizzle-kit push
   ```

## 7. Environment Variables
Update `.env` with the following:
```env
BETTER_AUTH_SECRET=your_generated_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```
