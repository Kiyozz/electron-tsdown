# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Plans

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.

## Commands

```bash
# Build a package
pnpm --filter electron-esbuild build
pnpm --filter @electron-esbuild/create-app build

# Lint
pnpm --filter electron-esbuild lint
pnpm --filter @electron-esbuild/create-app lint

# Build all
pnpm -r build
```

No test suite exists. Build (`tsc -b && tsdown`) is the primary validation.

## Architecture

Monorepo with `pnpm` workspaces. Two published packages:

### `electron-esbuild` (packages/electron-esbuild)

CLI tool (`electron-esbuild dev|build`) that orchestrates building an Electron app:

- **Main process** → built via `tsdown` (TsdownBuilder)
- **Renderer process** → built via `vite` (ViteBuilder)

Flow: `run.ts` (CLI entry via meow) → `dev.ts`/`build.ts` commands → `Worker` loads & validates config (Zod) → `Config` instantiates builders → builders call `build()`/`dev()`.

Config is loaded from `electron-esbuild.config.yaml` (or `.js`/`.ts` via unconfig). The `defineConfig()` function is the library export for typed config.

Key dirs in `src/`:

- `builder/` — `TsdownBuilder`, `ViteBuilder`, `BaseBuilder`
- `config/configurators/` — per-bundler configurator classes
- `config/` — types, validation (Zod schemas), YAML parsing, constants
- `commands/` — `dev.ts`, `build.ts`

### `@electron-esbuild/create-app` (packages/create-app)

Scaffolding CLI (`npm init @electron-esbuild/app`). Uses `enquirer` for interactive prompts, picks a template from `templates/`, installs deps with detected package manager.

## Tooling

- **Build:** `tsc -b` then `tsdown` (bundles to `dist/`)
- **Linting:** ESLint with TypeScript parser + Prettier (80 cols, single quotes, no semis, trailing commas)
- **Git hooks:** husky + lint-staged (runs lint on commit)
- **Node:** ≥22 (pinned to 24 via Volta)
- **pnpm:** v10

## Changesets

Add a changeset file to `.changeset/` when changing a published package:

```md
---
'electron-esbuild': patch
---

Description.
```

Use `"@electron-esbuild/create-app"` for the create-app package.
