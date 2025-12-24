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
- `npx shadcn@latest add <component>`: Add new shadcn/ui components.

## Gemini Instructions
- When adding new features, prioritize using existing shadcn/ui components or adding new ones from the registry if needed.
- Ensure all new components are properly typed with TypeScript.
- Follow the App Router conventions for data fetching and routing.
- Keep the UI consistent with the "radix-mira" style defined in `components.json`.
