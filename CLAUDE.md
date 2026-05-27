# ProductHubb Development Guide

## Project Overview
ProductHubb is a production-grade quoting system.
**Tech Stack:** Next.js (Web), Node.js/Express (API), MongoDB, AWS, GitLab.
**Architecture:** Monorepo managed by Turborepo.

## Architecture Patterns
- **Monorepo:** Shared types and Zod schemas reside in `packages/shared`. All apps must import from here to ensure API consistency.
- **Backend:** Layered Architecture:
  - `Controllers`: Handle HTTP requests/responses. Thin layer.
  - `Services`: Core business logic (e.g., quoting engine, price calculations).
  - `Repositories`: Direct MongoDB interactions using Mongoose.
  - `Middleware`: Auth, Zod validation, and error handling.
- **Frontend:** Feature-based structure in `src/features/`.
  - State: TanStack Query for server state, Zustand for global client state.
  - UI: Tailwind CSS + shadcn/ui.

## Development Standards
- **Naming Conventions:**
  - Components: `PascalCase` (e.g., `QuoteEditor.tsx`).
  - Functions/Variables: `camelCase` (e.g., `calculateTotalAmount`).
  - Files/Folders: `kebab-case` (e.g., `quote-service.ts`).
- **TypeScript:** 
  - Strict mode enabled. 
  - No `any` types; use `unknown` or explicit interfaces.
  - Prefer Zod for runtime validation at all boundaries.
- **Commit Messages:** Follow Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`).
- **Error Handling:**
  - API: Centralized error handling middleware.
  - Frontend: Use Error Boundaries and Zod for API response validation.

## Workflow
- Use `turbo run dev` for local development.
- Build the entire project: `npm run build`.
- New features should start with a definition in `packages/shared` (schemas) $\rightarrow$ Backend Service $\rightarrow$ Controller $\rightarrow$ Frontend Feature.

## Build & Configuration
- **Monorepo Tooling:** Managed by Turborepo. Use `tasks` in `turbo.json` for pipeline definitions.
- **TypeScript:**
  - Root `tsconfig.json` defines global compiler options and shared paths.
  - App/Package-specific `tsconfig.json` files extend the root config.
  - Shared types reside in `packages/shared/src/types`.
- **Build Command:** `npm run build` triggers `turbo run build`, which handles dependencies across the workspace.
