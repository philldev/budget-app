# Budget App - Gemini Context

This file provides context and instructions for the Gemini CLI agent to assist in developing the **Budget App**.

## Project Overview
A modern budget tracking application built with Next.js, focused on providing a clean user interface and efficient financial management tools.

## Tech Stack
- **Framework:** [Next.js 15.1.x](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (using Radix Mira style)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Package Manager:** [Bun](https://bun.sh/)

## Project Structure
- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable React components.
  - `ui/`: shadcn/ui base components.
- `lib/`: Utility functions and shared logic.
- `public/`: Static assets.

## Coding Standards & Conventions
- **Components:** Use functional components with TypeScript interfaces for props.
- **Styling:** Prefer Tailwind CSS utility classes. Follow the established shadcn/ui patterns.
- **Naming:** 
  - Components: PascalCase (e.g., `BudgetTable.tsx`).
  - Functions/Variables: camelCase.
  - Files: kebab-case or PascalCase (matching component name).
- **Icons:** Always use `lucide-react` for icons.

## Common Commands
- `bun dev`: Start the development server.
- `bun run build`: Build the application for production.
- `bun run lint`: Run ESLint for code quality checks.
- `bunx shadcn@latest add <component>`: Add new shadcn/ui components.

## Gemini Instructions
- **STRICTLY** use `bun` for all package management and script execution. NEVER use `npm`, `yarn`, or `npx`.
- When adding new features, prioritize using existing shadcn/ui components or adding new ones from the registry if needed.
- **NEVER** update shadcn component files (located in `components/ui/`) unless explicitly requested by the user.
- Ensure all new components are properly typed with TypeScript.
- Follow the App Router conventions for data fetching and routing.
- Keep the UI consistent with the "radix-mira" style defined in `components.json`.

## UI & Styling Standards

All UI development must strictly follow a compact and minimalist aesthetic, prioritizing high-density, utility-focused interfaces for interactive elements.

### Spacing & Layout (Tailwind v4)
- **Density:** Use tight spacing. Prefer `gap-4` for form grids and `p-6` (or standard Card padding) for containers.
- **Grids:** Utilize `grid-cols-2` for compact forms within cards (`max-w-md` or `max-w-sm`).
- **Alignment:** Use `ml-auto` for right-aligning secondary elements (e.g., badges in footers).

### Interactive Components
- **Sizing:** Default to small/compact sizes. Use `size="sm"` for dialogs/modals where content permits.
- **Buttons:** Use `variant="ghost"` or `size="icon"` for secondary actions to reduce visual noise. Use `variant="outline"` for cancel actions.
- **Inputs:** Maintain standard `shadcn/ui` heights (typically `h-9` or `h-10`) with `text-sm` for a refined look.
- **Cards:** Restrict max widths (`max-w-sm`, `max-w-md`) to avoid stretched UIs. Use `pt-0` when media/headers interact.

### Visual Style
- **Minimalism:** Lean on `variant="secondary"` for badges and `variant="ghost"` for icon-only buttons.
- **Icons:** Use `lucide-react` icons extensively for clearer, text-light navigation (e.g., inside Dropdowns).
- **Separators:** Use `DropdownMenuSeparator` or similar dividers to organize dense menus without adding heavy margins.
