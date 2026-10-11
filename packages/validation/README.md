# @nbw/validation

Shared **Zod** schemas and inferred TypeScript types used across the monorepo (NestJS API, frontend, `@nbw/database`, etc.). This package is the single source of truth for request/response shapes, env validation, and related DTOs.

## Layout

- `src/**/*.dto.ts` — Zod schemas and exports (`z.infer` types where needed)
- `src/common/` — shared helpers (e.g. `jsonStringField`) and pagination types
- `dist/` — compiled ESM (`tsc`); consume via the package `exports` entry

## Scripts

From this directory (or via the workspace root with a filter):

| Command         | Description                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------- |
| `bun run build` | Clean `dist`, emit JS (`tsconfig.build.json`), then declaration files (`tsconfig.types.json`) |
| `bun run dev`   | Watch mode for JS emit                                                                        |
| `bun run test`  | Run `*.spec.ts` under `src/` (Bun test runner)                                                |
| `bun run lint`  | ESLint on `src/**/*.ts`                                                                       |
| `bun run clean` | Remove `dist`                                                                                 |

## Consumers

Import from `@nbw/validation` after a successful build. Apps that bundle for the browser rely on **ESM** output; run `bun run build` in this package when schemas change so `dist/` stays in sync.
