# Plan: Database Maintenance Scripts

**Objective:**
Provide a set of scripts to easily manage database migrations, clear data, and reset the environment.

**Proposed Scripts:**
1.  **`db:generate`**: Generates Drizzle migration files based on the schema.
2.  **`db:push`**: Syncs the schema directly to the Turso database (convenient for development).
3.  **`db:clear`**: Drops all tables in the database.
4.  **`db:reset`**: A compound script that clears the database, syncs the schema, and seeds the data.

**Implementation Steps:**
1.  **Create `lib/db/clear.ts`**:
    - Script to drop all tables (`transactions`, `budgets`, `user`, etc.).
2.  **Update `package.json`**:
    - Add the new scripts to the `scripts` section.
3.  **Verification**:
    - Test each script individually.
    - Run `bun run db:reset` to verify the full flow.

**Script Definitions:**
- `"db:generate": "bunx drizzle-kit generate"`
- `"db:push": "bunx drizzle-kit push"`
- `"db:clear": "bun lib/db/clear.ts"`
- `"db:reset": "bun run db:clear && bun run db:push && bun run db:seed"`
