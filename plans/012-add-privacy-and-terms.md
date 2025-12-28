# Plan: Add Privacy Policy and Terms Pages

**Objective:**
Provide clear documentation regarding the personal nature of the project and the creator's lack of liability for user data.

**Requirements:**
1. **Privacy Policy Page (`/privacy`):**
   - State that it's a personal project.
   - Outline what data is collected (e.g., Google profile for auth, budget data).
   - State that data is stored in Turso but not managed professionally.
2. **Terms of Service Page (`/terms`):**
   - State "at your own risk" usage.
   - Disclaimer of responsibility for any data loss or security issues.
   - Personal project for portfolio purposes.
3. **Navigation:**
   - Link these pages from the footer of the landing page.

**Implementation Steps:**
1. **Create `app/privacy/page.tsx`**: Simple, high-density layout.
2. **Create `app/terms/page.tsx`**: Simple, high-density layout.
3. **Update `app/page.tsx`**: Add links to the footer.
4. **Verification**: 
   - Check the pages in the browser.
   - Run `bun run lint`.
