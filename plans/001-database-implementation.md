# Implementation Plan: Database with Drizzle ORM and Turso

This plan outlines the steps taken to integrate Drizzle ORM with Turso (SQLite) into the Budget App.

## 1. Prerequisites & Dependencies

Install the necessary packages for Drizzle, Turso, and unique ID generation:

```bash
bun add drizzle-orm @libsql/client @paralleldrive/cuid2
bun add -D drizzle-kit dotenv
```

## 2. Environment Configuration

The following variables must be defined in `.env.local`:

- `TURSO_DATABASE_URL`: The URL of your Turso database (e.g., `libsql://...`).
- `TURSO_AUTH_TOKEN`: Your Turso API key.

## 3. Drizzle Configuration

`drizzle.config.ts` is configured to use the `turso` dialect.

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
```

## 4. Database Connection

The database client is initialized in `lib/db/index.ts`.

```typescript
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });
```

## 5. Schema Definition

The schema is defined in `lib/db/schema.ts` using `cuid2` for client-side ID generation:
- `budgets`: Stores budget metadata (name, month, year).
- `transactions`: Stores income and expense entries linked to budgets.

## 6. Migration & Seeding Workflow

- **Sync Schema:** `bunx drizzle-kit push`
- **Seed Data:** `bun run db:seed` (Executes `lib/db/seed.ts`)

## 7. Status

- [x] Dependencies installed.
- [x] Schema defined and pushed to Turso.
- [x] Database seeding implemented and executed.
- [x] Types updated in `lib/types.ts` to use Drizzle-inferred models.