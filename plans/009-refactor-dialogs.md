# Plan: Refactor Dialogs into Separate Components

**Objective:**
Extract Dialog JSX and logic from `app/budgets/page.tsx` and `app/budgets/[id]/page.tsx` into dedicated, reusable components.

**Proposed Components:**
1.  **`BudgetDialog`**: 
    - Handles creation and editing of budgets.
    - Used in `app/budgets/page.tsx` and `app/budgets/[id]/page.tsx`.
    - Location: `components/budgets/budget-dialog.tsx`.
2.  **`TransactionDialog`**:
    - Handles creation and editing of transactions.
    - Includes the recently added IDR currency input, type button group, and "Add another" functionality.
    - Used in `app/budgets/[id]/page.tsx`.
    - Location: `components/transactions/transaction-dialog.tsx`.

**Implementation Steps:**
1.  **Create `components/budgets/budget-dialog.tsx`**:
    - Extract state management or pass as props (open, onOpenChange, editingBudget, onSuccess).
    - Move `handleSaveBudget` logic.
2.  **Create `components/transactions/transaction-dialog.tsx`**:
    - Extract state management or pass as props (open, onOpenChange, editingTransaction, budgetId, onSuccess).
    - Move `handleSaveTransaction` and `addAnother` logic.
3.  **Update `app/budgets/page.tsx`**:
    - Replace inline `Dialog` with `<BudgetDialog />`.
4.  **Update `app/budgets/[id]/page.tsx`**:
    - Replace inline budget `Dialog` with `<BudgetDialog />`.
    - Replace inline transaction `Dialog` with `<TransactionDialog />`.
5.  **Verification**:
    - Ensure all form functionality (validation, submission, "Add another") remains intact.
    - Run `bun run lint`.

**Benefits:**
- Reduces the size and complexity of page files.
- Improves reusability of the Budget form.
- Cleaner separation of concerns.
