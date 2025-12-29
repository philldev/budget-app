# Add Sticky Footer to Dashboard Layout

## Objective
Add a clean, minimal, and sticky footer to the dashboard layout (`app/(dashboard)/layout.tsx`) that contains the app logo, name, static page links, and social media links in a single row.

## Proposed Changes

1.  **Create `components/shared/footer.tsx`**
    *   **Content:**
        *   Logo (using `Wallet` icon) and name "BudgetApp".
        *   Links to "Privacy" and "Terms".
        *   Social media icons (GitHub and Twitter/X) with placeholders.
    *   **Styling:**
        *   Compact, minimalist aesthetic following the project's standards.
        *   High-density interface elements.
        *   Single-row layout using flexbox.
        *   Border top to separate from content.

2.  **Update `app/(dashboard)/layout.tsx`**
    *   Import the `Footer` component.
    *   Refactor the layout to use a flex container (`flex flex-col min-h-screen`) to ensure the footer is pushed to the bottom.
    *   Ensure the main content area (`children`) expands to fill available space (`flex-1`).

