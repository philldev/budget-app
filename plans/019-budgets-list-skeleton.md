# Add Skeleton Loading UI to Budgets Page

## Objective
Implement a clean skeleton loading UI for the Budgets list page (`app/(dashboard)/budgets/page.tsx`) to improve perceived performance and eliminate layout shifts.

## Proposed Changes

1.  **Create `components/budgets/budgets-list-skeleton.tsx`**
    *   Implement a skeleton for the filters and list section of the Budgets page.
    *   Include:
        *   **Filter Skeleton:** Skeleton for the search input and the two select dropdowns (Year and Sort).
        *   **List Skeleton:** 5 items matching the budget list item structure (Icon, Title, Description, and Action button).

2.  **Update `app/(dashboard)/budgets/page.tsx`**
    *   Import `BudgetsListSkeleton`.
    *   Replace the `isLoading` conditional block (which currently shows `Loader2`) with `<BudgetsListSkeleton />`.
    *   Keep the `DashboardHeader` visible and static as it contains immediate actions.

