# Plan: Implement Alert Dialog for Deletion Actions

**Objective:**
Replace standard browser `confirm()` calls with a consistent, styled `AlertDialog` component for all destructive actions (deleting budgets and transactions).

**Requirements:**
1.  **Reusable Wrapper:** Create a `DeleteConfirmDialog` component to simplify the usage of shadcn's `AlertDialog`.
2.  **Budget Deletion:** 
    - Update `app/budgets/page.tsx` to use the new dialog.
    - Update `app/budgets/[id]/page.tsx` to use the new dialog for deleting the current budget.
3.  **Transaction Deletion:**
    - Update `app/budgets/[id]/page.tsx` to require confirmation before deleting a transaction.

**Implementation Steps:**
1.  **Create `components/shared/delete-confirm-dialog.tsx`**:
    - Wrap `AlertDialog` components.
    - Props: `open`, `onOpenChange`, `onConfirm`, `title`, `description`, `isLoading`.
2.  **Update `app/budgets/page.tsx`**:
    - Add `isDeleteDialogOpen` and `budgetToDelete` state.
    - Trigger dialog instead of `confirm()`.
3.  **Update `app/budgets/[id]/page.tsx`**:
    - **Budget Deletion**: Add `isDeleteBudgetDialogOpen` state.
    - **Transaction Deletion**: Add `isDeleteTransactionDialogOpen` and `transactionToDelete` state.
    - Integrate the `DeleteConfirmDialog` for both.
4.  **Verification**:
    - Test deleting a budget from the list view.
    - Test deleting a budget from the detail view.
    - Test deleting a transaction.
    - Run `bun run lint`.
