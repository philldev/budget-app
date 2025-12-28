# Plan: Update Transaction Form Layout

**Objective:**
Improve the visual hierarchy and UX of the transaction form by giving the transaction type selection its own row and enhancing its appearance.

**Requirements:**
1. **Dedicated Row for Transaction Type:** Move the "Type" (Income/Expense) selection to its own row in the form.
2. **Button Group Styling:** Use a 2-column grid for the buttons to make them span the full width of the form.
3. **Larger Buttons:** Increase the size of the buttons (e.g., from `sm` to `default` or custom height) for better accessibility and visual prominence.
4. **Icons:** Keep the `TrendingUp` and `TrendingDown` icons.

**Implementation Steps:**
1. **Update `components/transactions/transaction-dialog.tsx`:**
   - Move the "Type" `Field` out of the `grid-cols-2` div.
   - Adjust the "Amount" `Field` to take full width (or keep it in a grid if preferred, but the request implies individual rows).
   - Change button `size` to `default` or `lg` (or `h-10`/`h-11`).
   - Ensure the button group looks cohesive.
2. **Verification:**
   - Check the form layout in the UI.
   - Run `bun run lint`.
