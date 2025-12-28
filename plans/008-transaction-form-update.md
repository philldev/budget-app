# Plan: Transaction Form Update

**Objective:**
Enhance the transaction form in the Budget Detail page to improve UX and handle IDR currency formatting.

**Requirements:**
1. **IDR Currency Input:**
   - Use `NumericFormat` from `react-number-format`.
   - Prefix with "Rp".
   - Support decimal places.
2. **Transaction Type Button Group:**
   - 2-column grid for Income and Expense.
   - Include icons (`TrendingUp` for income, `TrendingDown` for expense).
   - Clear active/inactive states.
3. **"Add Another" Functionality:**
   - Add a checkbox to allow adding multiple transactions without closing the dialog.
   - Logic to reset the form but keep the dialog open upon successful submission.

**Implementation Steps:**
1. **State Management:**
   - Add `addAnother` state (boolean).
   - Integrate `NumericFormat` for handling decimal amounts.
2. **UI Components:**
   - Implement the button group for type selection.
   - Add the `Checkbox` component (already added to `components/ui/checkbox.tsx`).
   - Wrap the amount input with `NumericFormat`.
3. **Submission Logic:**
   - Update `handleSave` to respect the `addAnother` flag.
   - Ensure "Edit" mode ignores the `addAnother` flag (usually closes on save).
4. **Verification:**
   - Test adding income and expense.
   - Verify IDR formatting.
   - Verify "Add another" behavior.
