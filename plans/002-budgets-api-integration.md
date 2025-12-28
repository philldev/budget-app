# Implementation Plan: Budgets API & Data Fetching

This plan outlines the integration of Budget management using Next.js Route Handlers and React Query.

## 1. API Routes (`app/api/budgets/`)

Implement the following endpoints in `app/api/budgets/route.ts` and `app/api/budgets/[id]/route.ts`:

- `GET /api/budgets`: Fetch all budgets.
- `POST /api/budgets`: Create a new budget.
- `GET /api/budgets/[id]`: Fetch a single budget.
- `PATCH /api/budgets/[id]`: Update a budget.
- `DELETE /api/budgets/[id]`: Delete a budget (and its transactions).

## 2. React Query Integration

### Provider Setup
Create a `components/providers/query-provider.tsx` and wrap the root layout.

### Hooks (`lib/hooks/use-budgets.ts`)
Implement custom hooks for budget operations:
- `useGetBudgets()`: Fetches all budgets.
- `useGetBudget(id)`: Fetches a single budget.
- `useCreateBudget()`: Mutation for adding a budget.
- `useUpdateBudget()`: Mutation for editing a budget.
- `useDeleteBudget()`: Mutation for removing a budget.

## 3. UI Refactoring (`app/budgets/page.tsx`)

- Replace `useState` mock data with `useGetBudgets()`.
- Connect the "Create Budget" dialog to `useCreateBudget()`.
- Connect the "Edit" and "Delete" actions in the `DropdownMenu` to their respective mutations.
- Implement loading states (skeleton loaders) and error handling.

## 4. Status
- [x] API Routes implemented.
- [x] Query Provider configured.
- [x] Custom hooks created.
- [x] UI connected to live data.
