# AI Rules and Guidelines

This document outlines the technical stack and specific library usage rules for AI assistance on this project.

## Tech Stack

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn/ui (built on Radix UI)
*   **Animation:** Framer Motion
*   **Forms:** React Hook Form with Zod for validation
*   **Icons:** Lucide React
*   **Carousel:** Embla Carousel (used via shadcn/ui)
*   **Date Pickers:** React Day Picker (used via shadcn/ui)
*   **Intersection Observation:** React Intersection Observer
*   **Resizable Panels:** React Resizable Panels (used via shadcn/ui)
*   **Swiping:** React Swipeable
*   **Charts:** Recharts (used via shadcn/ui)
*   **Toasts:** Sonner (used via shadcn/ui)
*   **Drawers:** Vaul (used via shadcn/ui)

## Library Usage Rules

*   **UI Components:** Always use components from `shadcn/ui` when a suitable component exists (e.g., Button, Dialog, Card, Tabs, etc.). Do not create custom versions of components already provided by shadcn/ui unless absolutely necessary and explicitly requested.
*   **Styling:** Use Tailwind CSS classes for all styling. Avoid inline styles or separate CSS modules unless specifically required for complex, non-Tailwind patterns (which should be rare).
*   **Animations:** Use Framer Motion for component animations and transitions.
*   **Forms:** Implement forms using React Hook Form for state management and Zod for schema validation.
*   **Icons:** Use icons from the `lucide-react` library.
*   **Data Fetching:** Use standard `fetch` API or custom hooks built on `fetch` (like `useAssetHolders`) for data retrieval from API routes.
*   **State Management:** Prefer `useState` and `useContext` for local and shared component state. Avoid complex state management libraries unless the application complexity explicitly demands it (not currently the case).
*   **API Routes:** Implement backend logic and external API calls within Next.js API routes (`app/api`). Do not expose API keys or sensitive information in client-side code.
*   **File Structure:** Maintain the existing file structure (`app`, `components`, `lib`, `hooks`, `contexts`, `styles`, `utils`). Place components in `components/`, pages in `app/`, hooks in `hooks/`, contexts in `contexts/`, and utility functions in `lib/` or `utils/`.
*   **Context Isolation:** Use the `createIsolatedContext` and `IsolatedProvider` helpers from `lib/context-isolation.tsx` for creating new React contexts to prevent potential conflicts in the preview environment.
*   **React Isolation:** The `ReactIsolator` component and the `reactFixScript` are in place to handle potential React renderer issues in the preview environment. Do not remove or modify these unless specifically instructed.
*   **Responsiveness:** Ensure all components and layouts are responsive using Tailwind's utility classes and media queries.
*   **Code Style:** Adhere to the existing TypeScript and React coding style, including proper type annotations.
*   **No Shell Commands:** Do not instruct the user to run shell commands. Use the provided UI commands (`<dyad-command>`) when necessary.