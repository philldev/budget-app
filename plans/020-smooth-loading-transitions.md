# Add Smooth Loading Transitions

## Objective
Implement smooth fade-in/out transitions between loading (skeleton) and loaded states for the Budgets list and Budget Detail pages using `motion/react`.

## Proposed Changes

1.  **Update `app/(dashboard)/budgets/page.tsx`**
    *   Import `AnimatePresence` and `motion` from `motion/react`.
    *   Wrap the `isLoading` ternary operator with `AnimatePresence` using `mode="wait"`.
    *   Wrap `BudgetsListSkeleton` in a `motion.div` with keys for proper exit animations.
    *   Wrap the actual content (filters and budget list) in a `motion.div`.

2.  **Update `app/(dashboard)/budgets/[id]/page.tsx`**
    *   Import `AnimatePresence` and `motion` from `motion/react`.
    *   Remove the early return for `isLoadingBudget`.
    *   Refactor the JSX to use `AnimatePresence mode="wait"` for the main body content.
    *   Ensure the `DashboardHeader` remains static at the top to keep the "Back" button interactive, but its `title` and `description` props will react to the `isLoadingBudget` state.
    *   Wrap `BudgetDetailSkeleton` and the main page content in `motion.div` components.

## Implementation Details
*   **Initial:** `{ opacity: 0 }`
*   **Animate:** `{ opacity: 1 }`
*   **Exit:** `{ opacity: 0 }`
*   **Transition:** `{ duration: 0.2 }` for exit and `{ duration: 0.3 }` for enter, matching the `AuthGuard` style.
