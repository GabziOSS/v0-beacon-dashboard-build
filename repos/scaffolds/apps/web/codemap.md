# apps/web Codemap

This document outlines the responsibilities, design patterns, and flow of the `apps/web` directory, which hosts a React application built with Vite, TanStack Router, Tailwind CSS, and Nitro.

## Directory Structure and Key Files

### `apps/web/package.json`

- **Responsibility**:
  - Defines the `web` application's specific metadata, scripts, and dependencies.
  - Orchestrates development tasks using `vite` (for `dev`, `build`, `preview`), `eslint` (for `lint`), `prettier` (for `format`), and `tsc` (for `typecheck`).
- **Key Dependencies**:
  - `@tanstack/react-router`, `@tanstack/react-start`, `@tanstack/router-plugin`: Core libraries for client-side routing using TanStack Router.
  - `nitro`: Used for server-side rendering, API routes, or other server-side functionalities.
  - `react`, `react-dom`: The fundamental libraries for building user interfaces with React.
  - `tailwindcss`, `@tailwindcss/vite`: For utility-first CSS styling.
  - `@workspace/ui`: A local workspace package, indicating the consumption of shared UI components or design system elements from within the monorepo.
- **Design Patterns/Flow**:
  - Acts as the manifest for the `web` application, detailing its runtime and development requirements.
  - Employs a modern web development stack centered around React, Vite, and TanStack Router, with server-side enhancements from Nitro.

### `apps/web/tsconfig.json`

- **Responsibility**:
  - Provides TypeScript configuration specific to the `web` application.
  - Extends the workspace's base TypeScript configuration implicitly or explicitly (though not explicitly `extends` in this file, it's part of the overall TS setup).
  - Defines compiler options tailored for a React/Vite project, such as `jsx: "react-jsx"`, `moduleResolution: "bundler"`, and `noEmit: true` (as Vite handles the JavaScript emission).
- **Paths**:
  - Configures path aliases: `@/*` maps to `./src/*` and `@workspace/ui/*` maps to `../../packages/ui/src/*`, simplifying module imports and promoting a cleaner codebase.
- **Design Patterns/Flow**:
  - Ensures proper TypeScript compilation and type checking for the React application.
  - Integrates seamlessly with Vite's build process and facilitates efficient module resolution within the monorepo structure.

### `apps/web/vite.config.ts`

- **Responsibility**:
  - The Vite configuration file, defining how the `web` application is built, served, and optimized.
- **Plugins**:
  - `nitro()`: Integrates Nitro for server-side functionalities, potentially enabling server routes, API endpoints, or server-side rendering.
  - `viteTsConfigPaths()`: Resolves TypeScript path aliases defined in `tsconfig.json` during the Vite build process.
  - `tailwindcss()`: Integrates Tailwind CSS with Vite, enabling JIT compilation and efficient styling.
  - `tanstackStart()`: A plugin for TanStack Start, which likely includes configurations for TanStack Router and other related utilities.
  - `viteReact()`: Provides essential React support for Vite, including Fast Refresh.
- **Design Patterns/Flow**:
  - This file is the central configuration for the `web` application's build system, orchestrating various plugins to support React, TypeScript, Tailwind CSS, and Nitro within the Vite ecosystem.
  - Follows a plugin-based architecture, common in modern build tools, to extend functionality.

### `apps/web/eslint.config.js`

- **Responsibility**:
  - ESLint configuration specific to the `web` application.
  - Imports and extends `@tanstack/eslint-config`, ensuring consistent code quality and style guidelines across the project, potentially aligning with TanStack's recommendations.
- **Design Patterns/Flow**:
  - Enforces code quality and style guidelines using ESLint, leveraging a shared and opinionated configuration.

### `apps/web/src/` Directory

- **`routeTree.gen.ts`**:
  - **Responsibility**: An auto-generated file by TanStack Router, which typically defines the application's route tree based on a file-system routing convention (e.g., files within `src/routes/`).
  - **Design Patterns/Flow**: Implements file-system based routing, where the directory structure directly maps to the application's routes, reducing manual route configuration.

- **`router.tsx`**:
  - **Responsibility**: The main entry point for configuring and instantiating the TanStack Router. It likely imports the `routeTree` and sets up the router instance that will be used throughout the application.
  - **Design Patterns/Flow**: Centralizes the routing logic, making it easy to manage and extend the application's navigation.

- **`routes/`**:
  - **Responsibility**: This directory is expected to contain the individual route components or route definitions for the application. Each file or subdirectory within `routes/` typically corresponds to a specific route or a group of nested routes.
  - **Design Patterns/Flow**: Follows a file-system routing convention, where the structure of this directory dictates the application's URL paths and corresponding components. This promotes discoverability and organization of routes.

## Overall Responsibility, Design Patterns, and Flow

The `apps/web` project is a modern, full-stack React application. It leverages:

- **React**: For building dynamic and interactive user interfaces.
- **Vite**: As a fast development server and build tool.
- **TanStack Router**: For robust and type-safe client-side routing, likely utilizing file-system based routing for organization.
- **Tailwind CSS**: For efficient and scalable styling.
- **Nitro**: For server-side capabilities, potentially including API routes, server-side rendering, or other backend logic.
- **TypeScript**: For type safety and improved developer experience across the entire codebase.
- **Nx Monorepo Integration**: It benefits from the monorepo structure by consuming shared UI components (`@workspace/ui`) and adhering to workspace-wide configurations for linting and TypeScript.

The flow typically involves:

1.  **Development**: `vite dev` starts the development server, with Fast Refresh for React components.
2.  **Routing**: TanStack Router dynamically generates routes from the `src/routes/` directory, handled by `router.tsx`.
3.  **Styling**: Tailwind CSS processes styles during development and build.
4.  **Server-side**: Nitro handles any server-side logic or API calls.
5.  **Build**: `vite build` compiles the application for production, optimized by Vite and its plugins.
