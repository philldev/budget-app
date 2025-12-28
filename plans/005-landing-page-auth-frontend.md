# Implementation Plan: Landing Page & Auth Frontend

This plan outlines the steps to implement a responsive landing page and a Navbar that handles authentication states using Better-Auth and shadcn/ui.

## Phase 1: shadcn & Client Setup

### 1.1 Add Required shadcn/ui Components
We need several components for the Navbar and Landing Page. Run the following command:

```bash
bunx shadcn@latest add avatar dropdown-menu skeleton
```

*Note: `button` is already present in `components/ui/`.*

### 1.2 Verify Auth Client
`lib/auth-client.ts` is already configured:

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});
```

## Phase 2: Auth Components

### 2.1 User Navigation Component
This component will now be used directly in private dashboard pages.

```typescript
"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// ... (rest of UserNav code)
```

### 2.2 Auth Buttons Component
Create `components/auth/auth-buttons.tsx` for sign-in actions, to be used on the landing page.

```typescript
// ... (SignInButton code)
```

## Phase 4: Integration Logic

### 4.1 Landing Page Login
The landing page will now conditionally show the `SignInButton` if no session is active, or a "Go to Dashboard" button if the user is already logged in.

### 4.2 Dashboard Logout
Private routes (e.g., `/budgets`) will include the `UserNav` in their local layout or header to allow users to manage their profile and log out.

