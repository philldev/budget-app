# Combine Budgets Layout using Route Group

## Objective
Reduce code duplication between `app/budgets/page.tsx` and `app/budgets/[id]/page.tsx` by introducing a shared layout within a route group.

## Proposed Changes

1.  **Introduce Route Group `(dashboard)`**
    *   Move `app/budgets` to `app/(dashboard)/budgets`.
    *   Apply a shared layout to all dashboard-related pages.

2.  **Create `components/auth/auth-guard.tsx`**
    *   Client-side component that uses `authClient.useSession()`.
    *   Redirects to `/` if the user is unauthenticated.
    *   Shows a loading spinner while checking session.

3.  **Create `components/shared/dashboard-header.tsx`**
    *   Extract the common header structure.
    *   **Props:**
        *   `title`: `React.ReactNode`
        *   `description`: `React.ReactNode`
        *   `backLink?`: `{ href: string; label: string }`
        *   `actions?`: `React.ReactNode`
    *   Includes `UserNav` internally to avoid passing it every time.

4.  **Create `app/(dashboard)/layout.tsx`**
    *   Wraps children with `AuthGuard`.
    *   Provides the common container: `<div className="container mx-auto p-6 space-y-4 max-w-xl">`.

5.  **Refactor `app/(dashboard)/budgets/page.tsx`**
    *   Remove outer container.
    *   Use `DashboardHeader`.
    *   Remove local `UserNav` and `session` management if handled by header/layout.

6.  **Refactor `app/(dashboard)/budgets/[id]/page.tsx`**
    *   Remove outer container.
    *   Use `DashboardHeader`.
    *   Remove local `UserNav` and `session` management.

