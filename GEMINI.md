# GEMINI.md - Elchika Tools

This document provides a comprehensive overview of the Elchika Tools project, its architecture, and development conventions.

## Project Overview

Elchika Tools is a monorepo containing a collection of web-based utility applications. All tools are designed to be client-side only, ensuring user data privacy. The project is built with a modern frontend stack and emphasizes a unified design system and a streamlined development process for creating new applications.

**Key Technologies:**

*   **Framework:** React 18
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn/ui (built on Radix UI)
*   **Hosting:** Cloudflare Pages

**Architecture:**

The project is structured as a monorepo with individual applications located in the `apps/` directory. A shared design system and development guidelines are documented in the `__docs__/` directory, ensuring consistency across all tools.

## Building and Running

**1. Install Dependencies:**

```bash
# From the project root
bun install
```

**2. Run a Specific Application:**

Each application has its own development server. To run an application, use the `bun run dev:<app-name>` command from the project root.

```bash
# Example: Run the image-crop application
bun run dev:image-crop

# Example: Run the image-generate application
bun run dev:image-generate

# Example: Run the text-diff-checker application
bun run dev:text-diff-checker
```

**3. Build an Application:**

To build a specific application for production, navigate to the application's directory and run the `build` command.

```bash
cd apps/image-crop
bun run build
```

## Development Conventions

The project has a strong set of development conventions, documented in the `__docs__/` directory. Here is a summary of the key conventions:

**1. Creating a New Application:**

A script is provided to scaffold a new application.

```bash
npm run create-app <app-name>
```

This will create a new directory in `apps/` with the standard project structure and configuration.

**2. Design System:**

All applications must adhere to the design system defined in `__docs__/DESIGN_SYSTEM.md`. This includes:

*   **Layout:** A standard page structure with a consistent header and main content area. A 2-column layout is recommended for settings and preview panels.
*   **UI Components:** Use the provided `shadcn/ui` components.
*   **Styling:** Use Tailwind CSS with the provided CSS variables for theming.

**3. Directory Structure:**

Each application follows a standardized directory structure:

```
src/
├── components/
│   └── ui/         # shadcn/ui components
├── hooks/
├── utils/
├── config/
├── types/
├── App.tsx
├── main.tsx
└── index.css
```

**4. Naming Conventions:**

*   **Components:** `PascalCase` (e.g., `ImageUpload.tsx`)
*   **Hooks:** `useCamelCase` (e.g., `useCropState.ts`)
*   **Variables:** `camelCase`
*   **Constants:** `UPPER_SNAKE_CASE`

**5. Path Aliases:**

Use path aliases for cleaner imports.

*   `@components/*`
*   `@hooks/*`
*   `@utils/*`
*   `@config/*`
*   `@types`
*   `@lib/*`

**6. TypeScript:**

Strict mode is enforced. All props and states should be explicitly typed.
