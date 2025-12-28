# Implementation Plan: Transactions API & Data Fetching

This plan outlines the integration of Transaction management using Next.js Route Handlers and React Query.

## 1. API Routes (`app/api/transactions/`)

Implement the following endpoints:

- `GET /api/budgets/[id]/transactions`: Fetch all transactions for a specific budget.
- `POST /api/transactions`: Create a new transaction.
- `PATCH /api/transactions/[id]`: Update a transaction.
- `DELETE /api/transactions/[id]`: Delete a transaction.

## 2. React Query Integration

### Hooks (`lib/hooks/use-transactions.ts`)
Implement custom hooks for transaction operations:
- `useGetTransactions(budgetId)`: Fetches transactions for a specific budget.
- `useCreateTransaction()`: Mutation for adding a transaction.
- `useUpdateTransaction()`: Mutation for editing a transaction.
- `useDeleteTransaction()`: Mutation for removing a transaction.

## 3. UI Refactoring (`app/budgets/[id]/page.tsx`)

- Replace `useState` mock transactions with `useGetTransactions(budgetId)`.
- Replace mock budget data with `useGetBudget(budgetId)` (from budgets hooks).
- Connect "Add Transaction" dialog to `useCreateTransaction()`.
- Connect "Edit" and "Delete" transaction actions to mutations.
- Ensure summary calculations (Balance, Income, Expense) are derived from the live transaction data.

## 4. Status
- [x] API Routes implemented.
- [x] Custom hooks created.
- [x] UI connected to live data.
- [x] Summary calculations verified with live data.
