# Context
I have an existing Next.js project with Drizzle ORM and Turso (SQLite) already configured. My database instance is initialized and ready to use.

# Task
Create a plan to implement "Better-Auth" into this project.

# Technical Constraints
- Use the existing Drizzle instance.
- Database: Turso (SQLite).
- Auth: Better-Auth with the Drizzle Adapter.
- Framework: Next.js (App Router).

# Deliverables
1. **Schema Integration:** Provide the code for the Better-Auth tables (user, session, account, verification) using `sqliteTable` from `drizzle-orm/sqlite-core`. 
   *Note: Better-Auth provides a CLI, but I want to see the Drizzle schema code explicitly to add it to my existing schema file.*
2. **Auth Server Config:** Create `lib/auth.ts`.
   - Import my existing `db` instance.
   - Configure `betterAuth` using `drizzleAdapter`.
   - Include the `nextCookies` plugin for Next.js 15 support.
3. **API Route:** Create the catch-all route handler at `app/api/auth/[...all]/route.ts`.
4. **Auth Client:** Create `lib/auth-client.ts` using `better-auth/react`.
5. **Session Management:** Show how to:
   - Get the session in a Server Component using `auth.api.getSession`.
   - Use the `useSession` hook in a Client Component.
6. **CLI Commands:** List the commands to generate and push the new auth tables to Turso without wiping my existing data.

# Formatting
Please output the file paths clearly as headers and use high-quality, type-safe TypeScript code.
