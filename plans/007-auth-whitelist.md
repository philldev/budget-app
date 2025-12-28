# Implementation Plan: Auth Whitelist (Email Restriction)

This plan outlines the steps to restrict authentication to a specific list of Google accounts, ensuring only authorized users can access the application.

## Phase 1: Configuration

### 1.1 Create Whitelist File
Create `lib/auth-whitelist.ts` to store the list of allowed email addresses.

```typescript
export const AUTHORIZED_EMAILS = [
  "your-email@gmail.com",
  // Add other authorized emails here
];
```

## Phase 2: Backend Enforcement

### 2.1 Update `lib/auth.ts`
Implement a custom Better-Auth plugin to intercept the sign-in process and verify the user's email against the whitelist.

```typescript
import { AUTHORIZED_EMAILS } from "./auth-whitelist";

// ... inside betterAuth configuration
plugins: [
  nextCookies(),
  {
    id: "email-whitelist",
    hooks: {
      before: {
        signIn: async (context) => {
          // This hook runs before the session is created
          // We can check the email if it's available in the context
          // For social sign-in, we might need to check after the user is retrieved
        },
        createUser: async (context) => {
           const email = context.user.email;
           if (!AUTHORIZED_EMAILS.includes(email)) {
             throw new Error("Email not authorized");
           }
        }
      }
    }
  }
],
```

*Note: We will use the `database` hooks or a dedicated plugin hook to ensure that even if a user exists in the DB, they are blocked if removed from the whitelist.*

### 2.2 Refined Plugin Logic
A more robust way is to hook into the session creation or use the `onResponse` hook to block unauthorized users.

## Phase 3: Frontend Handling

### 3.1 Error Feedback
Update `components/auth/auth-buttons.tsx` to handle the "Email not authorized" error and show a user-friendly message (e.g., using a toast or simple text).

## Phase 4: Verification
1. Attempt to sign in with an email NOT in the whitelist -> Expect failure/redirect.
2. Attempt to sign in with an email IN the whitelist -> Expect success.
