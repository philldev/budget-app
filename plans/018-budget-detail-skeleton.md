# Add Skeleton Loading UI to Budget Detail Page

## Objective
Implement a clean skeleton loading UI for the Budget Detail page (`app/(dashboard)/budgets/[id]/page.tsx`) to improve perceived performance and eliminate layout shifts.

## Proposed Changes

1.  **Create `components/budgets/budget-detail-skeleton.tsx`**
    *   Implement a skeleton for the body of the Budget Detail page.
    *   **Excluded:** The header section (to be handled by the page to keep the back button functional).
    *   Include:
        *   **Balance Card Skeleton:** The large summary card.
        *   **Stats Skeleton:** The Income, Expense, and Highest expense sections.
        *   **Filter Skeleton:** The search input and sort select.
        *   **List Skeleton:** 5 items matching the `TransactionList` structure.

2.  **Update `components/transactions/transaction-list.tsx`**
    *   Add a `loadingItems?: number` prop.
    *   If `isLoading` is true, render a list of skeleton items.

3.  **Update `app/(dashboard)/budgets/[id]/page.tsx`**
    *   When `isLoadingBudget` is true, render the `DashboardHeader` with a functional `backLink` and skeletons for `title` and `description`.
    *   Render `<BudgetDetailSkeleton />` below the header.


