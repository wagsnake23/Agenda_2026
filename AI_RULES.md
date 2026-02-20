# AI Rules for this Project

This document outlines the core technologies used in this project and provides guidelines for library usage to maintain consistency and best practices.

## Tech Stack Description

*   **Frontend Framework**: React.js for building dynamic and interactive user interfaces.
*   **Language**: TypeScript, ensuring type safety and improving code quality and maintainability.
*   **Build Tool**: Vite, providing a fast development experience with hot module replacement.
*   **Styling**: Tailwind CSS for utility-first styling, enabling rapid UI development and responsive designs.
*   **UI Components**: shadcn/ui, a collection of beautifully designed, accessible, and customizable React components built with Radix UI and Tailwind CSS.
*   **Routing**: React Router DOM for declarative client-side routing.
*   **Data Fetching & State Management**: React Query (`@tanstack/react-query`) for efficient server state management, caching, and data synchronization.
*   **Date Manipulation**: `date-fns` for a comprehensive and lightweight set of functions to manipulate dates.
*   **Icons**: `lucide-react` for a consistent and customizable icon set.
*   **Toast Notifications**: `sonner` for elegant and simple toast notifications.

## Library Usage Rules

To ensure consistency and maintainability, please adhere to the following rules when developing:

*   **UI Components**: Always prioritize `shadcn/ui` components. If a specific component is not available, create a new, small, and focused component following `shadcn/ui`'s design principles and styling conventions using Tailwind CSS.
*   **Styling**: All styling must be done using **Tailwind CSS** utility classes. Avoid inline styles or custom CSS files unless absolutely necessary for global styles defined in `src/index.css`.
*   **Routing**: Use **React Router DOM** for all navigation and route management within the application. Keep routes defined in `src/App.tsx`.
*   **Data Fetching**: For any server-side data fetching, caching, and synchronization, use **React Query**.
*   **Date Operations**: All date parsing, formatting, and manipulation should be handled using **`date-fns`**.
*   **Icons**: Integrate icons using the **`lucide-react`** library.
*   **Toast Notifications**: For displaying simple, non-interactive notifications to the user, use **`sonner`**.
*   **Form Handling**: If new forms are introduced, use **`react-hook-form`** for form state management and **`zod`** for schema validation, integrated via `@hookform/resolvers`.
*   **Utility Classes**: When combining multiple Tailwind CSS classes conditionally, use the `cn` utility function from `src/lib/utils.ts` (which leverages `clsx` and `tailwind-merge`).