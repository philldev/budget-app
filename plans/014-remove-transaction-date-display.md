# Plan: Remove Date Display from Transaction List

**Objective:**
Clean up the transaction list UI by removing the date information from each transaction item.

**Requirements:**
1. **Remove Date:** Locate the `ItemDescription` within the transaction list in `app/budgets/[id]/page.tsx`.
2. **UI Refinement:** Update the description to only show the category, removing the bullet point and date.

**Implementation Steps:**
1. **Update `app/budgets/[id]/page.tsx`:**
   - Find the mapping of `filteredTransactions`.
   - Modify the `ItemDescription` component to remove `{transaction.date}` and the separator.
2. **Verification:**
   - Ensure the transaction list only displays the category.
   - Run `bun run lint`.
