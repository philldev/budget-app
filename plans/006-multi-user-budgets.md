# Implementation Plan: Multi-User Budgets

This plan outlines the steps to associate budgets with users, ensuring that users only see and manage their own data.

## Phase 1: Database Schema Updates

### 1.1 Update `budgets` table
Modify `lib/db/schema.ts` to add a `userId` foreign key to the `budgets` table.

```typescript
export const budgets = sqliteTable("budgets", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
```

### 1.2 Sync Database
Run `bunx drizzle-kit push` to apply the changes to Turso.
*Note: Existing budgets in the database may need to be cleared or manually assigned a user ID if the table is not empty.*

## Phase 2: Backend API Protection

### 2.1 Update Budget API Routes
Modify `app/api/budgets/route.ts` and `app/api/budgets/[id]/route.ts` to:
1.  Verify the user session using `auth.getSession(req)`.
2.  Filter queries by `userId`.
3.  Ensure users can only update/delete budgets they own.

Example for `GET /api/budgets`:
```typescript
const session = await auth.getSession({ hook: { prepend: req } });
if (!session) return new Response("Unauthorized", { status: 401 });

const userBudgets = await db
  .select()
  .from(budgets)
  .where(eq(budgets.userId, session.user.id));
```

### 2.2 Update Transaction API Routes
Update `app/api/budgets/[id]/transactions/route.ts` to ensure the parent budget belongs to the authenticated user before allowing transaction operations.

## Phase 3: Frontend Adjustments

### 3.1 Protected Routes
Implement middleware or layout-level checks to redirect unauthenticated users from `/budgets` to the landing page.

### 3.2 Data Fetching
Ensure the frontend hooks (`use-budgets.ts`, `use-transactions.ts`) don't require changes if the API correctly handles the session-based filtering, but verify that the `create` mutations now include the `userId` (or that the backend automatically assigns it from the session).

## Phase 4: Verification
1.  Sign in as User A, create a budget.
2.  Sign in as User B, verify User A's budget is not visible.
3.  Verify that unauthorized attempts to access `/api/budgets/[id]` return 401 or 404.
