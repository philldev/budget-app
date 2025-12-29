# Refactor Transaction List Component

## Objective
Extract the transaction list rendering logic from `app/budgets/[id]/page.tsx` into a reusable, standalone component `components/transactions/transaction-list.tsx`.

## Goal
Improve code maintainability and readability by separating the UI presentation of the transaction list from the page logic.

## Proposed Changes

1.  **Create `components/transactions/transaction-icon.tsx`**
    *   **Props:**
        *   `type`: `"income" | "expense"`
        *   `percentage`: `number`
    *   **Content:**
        *   The inline SVG logic for the circular transaction icon.
        *   Uses `percentage` to calculate the stroke-dashoffset.

2.  **Create `components/transactions/transaction-list.tsx`**
    *   **Props:**
        *   `transactions`: `Transaction[]`
        *   `isLoading`: `boolean`
        *   `totalIncome`: `number`
        *   `totalExpense`: `number`
        *   `highlightedId`: `string | null`
        *   `onEdit`: `(transaction: Transaction) => void`
        *   `onDelete`: `(id: string) => void`
    *   **Content:**
        *   Renders a spinner if `isLoading` is true.
        *   Renders "No transactions found" if `transactions` is empty.
        *   Renders the `ItemGroup` and mapped `Item`s.
        *   Uses `TransactionIcon` for each item.

3.  **Update `app/budgets/[id]/page.tsx`**
    *   Import `TransactionList`.
    *   Replace the manual rendering logic with `<TransactionList ... />`.


## Questions for User
1.  **Scope of Component:** Should the `TransactionList` be responsible for rendering the "Loading" and "Empty" states (as proposed), or should the parent page handle these conditional renders and only pass a valid list to the component?
2.  **Icon Extraction:** The list item currently contains a complex SVG for a circular progress icon. Should this be extracted into a further sub-component (e.g., `TransactionIcon`) or kept inline for now?
