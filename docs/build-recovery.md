# Build System Recovery Notes (May 2026)

This document records the critical fixes applied to restore the project's build capabilities.

## 1. Configuration Fixes
- **Turbo Compatibility**: Added `packageManager` to the root `package.json` and renamed `pipeline` $\rightarrow$ `tasks` in `turbo.json` to align with Turbo 2.0+ specifications.
- **TS Configuration**: Implemented a hierarchical `tsconfig` structure. Root config now handles base options and `paths` mapping, while individual apps extend this to maintain their own `rootDir` and `outDir`.

## 2. Type System Restoration
- **Shared Types**: Restored the missing type definitions in `packages/shared/src/types/index.ts` for `User`, `Product`, `Quote`, and `QuoteItem`.
- **Zod Integration**: Fixed ambiguous exports in `packages/shared/src/index.ts` by explicitly exporting schemas.

## 3. Critical Bug Fixes
### Backend (API)
- **PDF Generation**: Fixed `pdfkit` implementation. The `bold: true` option was removed in favor of `doc.font('Helvetica-Bold')` to avoid runtime crashes.
- **Quote Versioning**: Fixed a bug where `_id` (ObjectId) was being passed directly to `QuoteModel.create()`, which causes MongoDB errors. Now explicitly cast to string.
- **Type Casting**: Resolved `string | string[]` mismatches in controllers when accessing `req.params.id`.

### Frontend (Web)
- **Node Types**: Added `types: ["node"]` to `apps/web/tsconfig.json` to resolve `process` being undefined during the build.
- **Null Safety**: Added optional chaining and fallback values for `quote.createdAt` and `quote.id` in the UI to prevent build-time type errors.

## 4. Verified Build Path
The project now builds successfully using:
```bash
npm run build
```
This executes `turbo run build` across `@producthubb/shared`, `@producthubb/api`, and `@producthubb/web`.
