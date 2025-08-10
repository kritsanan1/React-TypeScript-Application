# AI Development Rules and Guidelines

This document outlines the core technologies used in this React TypeScript application and provides clear rules for library usage to ensure consistency, maintainability, and adherence to best practices.

## Tech Stack Overview

This application is built with a modern and efficient tech stack, focusing on developer experience and performance:

*   **React 18**: A declarative, component-based JavaScript library for building user interfaces.
*   **TypeScript**: A superset of JavaScript that adds static type definitions, enhancing code quality and developer productivity.
*   **Vite**: A fast and lightweight build tool and development server, providing instant hot module replacement.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs directly in your markup.
*   **Lucide React**: A collection of beautiful, customizable, and tree-shakable SVG icons for React applications.
*   **ESLint**: A pluggable linting utility for JavaScript and TypeScript, ensuring code quality and consistency.
*   **PostCSS**: A tool for transforming CSS with JavaScript plugins, used here for Tailwind CSS and Autoprefixer.
*   **React Router**: A standard library for routing in React applications, enabling navigation between different views.
*   **shadcn/ui**: A collection of re-usable components built with Radix UI and Tailwind CSS, designed to be copied and pasted into your projects.
*   **Radix UI**: A low-level UI component library for building high-quality, accessible design systems and web apps.

## Library Usage Rules

To maintain a consistent and efficient codebase, please adhere to the following guidelines for library usage:

*   **UI Components**:
    *   **Primary Choice**: Always prioritize using components from **shadcn/ui** for common UI elements (e.g., Button, Input, Dialog, Card). These components are pre-styled with Tailwind CSS and are accessible by default.
    *   **Underlying Components/Custom Builds**: If a specific shadcn/ui component is not available or requires deep customization, use **Radix UI** primitives as the foundation for building new, accessible components.
    *   **New Components**: Any new, reusable UI component should be created in `src/components/` and follow the project's component architecture guidelines.

*   **Styling**:
    *   **Exclusive Use**: **Tailwind CSS** must be used for all styling. Avoid writing custom CSS unless absolutely necessary for complex, non-utility-based styles (which should be rare and documented).
    *   **Responsive Design**: Always implement responsive designs using Tailwind's utility classes and mobile-first approach.

*   **Icons**:
    *   **Standard**: Use **Lucide React** for all icons within the application.

*   **Routing**:
    *   **Standard**: Use **React Router** for all client-side navigation. All main application routes should be defined and managed within `src/App.tsx`.

*   **State Management**:
    *   **Local State**: Use React's built-in `useState` and `useReducer` hooks for component-level state.
    *   **Shared Logic**: Extract reusable stateful logic into custom hooks in `src/hooks/`.
    *   **Global State**: For more complex global state management, consider React Context API (if simple) or discuss adding a dedicated state management library (e.g., Zustand, Redux Toolkit) if the need arises.

*   **Type Safety**:
    *   **Mandatory**: **TypeScript** must be used for all new and modified code. Ensure explicit types for props, state, function parameters, and return values.

*   **Build & Development**:
    *   **Standard**: **Vite** is the designated build tool and development server.
    *   **Code Quality**: **ESLint** is configured to enforce code style and identify potential issues. Always run `npm run lint` before committing.

*   **API Interaction**:
    *   For fetching data, use the native `fetch` API or discuss adding a dedicated data fetching library (e.g., React Query, Axios) if the application's data requirements become complex.

By adhering to these rules, we ensure a cohesive, high-quality, and easily maintainable application.