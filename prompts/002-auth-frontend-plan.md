# Context
Backend auth (Better-Auth + Drizzle + Turso) is already implemented. 
I am using **shadcn/ui** for my component library. 

# Task
Create a step-by-step implementation plan file for a Landing Page with a responsive Navbar that handles login and logout states.

# Implementation Phases

## Phase 1: shadcn & Client Setup
- List the `npx shadcn@latest add` commands for the components needed (e.g., button, dropdown-menu, avatar, skeleton).
- Provide the code for `lib/auth-client.ts` using `createAuthClient` from `better-auth/react`.

## Phase 2: The Auth Components (shadcn)
- Create a `components/auth/auth-buttons.tsx` file:
    - A `SignInButton` using shadcn `Button`.
    - A `UserNav` using shadcn `DropdownMenu` and `Avatar` (to show user profile + logout).
- Provide a `Navbar` component that uses `authClient.useSession()` to toggle between these two.

## Phase 3: The Landing Page
- Create `app/page.tsx` with a Hero section.
- Use shadcn's layout patterns (containers, typography).
- Include a "Get Started" button that triggers the login flow.

## Phase 4: Better-Auth Frontend Logic
- Show how to handle social sign-in (GitHub/Google) using the shadcn button's `onClick`.
- Explain how to handle the "Pending" state using shadcn's `Skeleton` so the navbar doesn't flicker while checking the session.

# Technical Requirements
- Next.js 15 (App Router)
- Better-Auth React Hooks
- shadcn/ui components
- Lucide React for icons

# Output Format
Format as a technical roadmap with clear file headers and production-ready TypeScript code.
