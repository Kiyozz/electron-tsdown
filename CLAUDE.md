# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Plans

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.

## Commands

```bash
# Build a package
pnpm --filter electron-tsdown build
pnpm --filter @electron-tsdown/create-app build

# Build all
pnpm -r build

# Lint / format (run from the root, recurses into both packages)
pnpm lint
pnpm lint:fix
pnpm fmt
pnpm fmt:check
```

No test suite exists. `pnpm -r build` (`tsc -b && tsdown`) is the primary validation.

## Architecture

Monorepo with `pnpm` workspaces. Two published packages.

### `electron-tsdown` (packages/electron-tsdown)

CLI (`electron-tsdown dev|build`) that orchestrates building an Electron app:

- **Main process** → `tsdown` (`TsdownBundler`)
- **Renderer process** → `vite` (`ViteBundler`)

Flow: `run.ts` (cac CLI, `__VERSION__` replaced at build time) → `container.ts` (`@adonisjs/fold` IoC) → `BuildCommand`/`DevCommand` → `ConfigLoader` (unconfig) → `AppConfig` (Zod validation) → `BuildOrchestrator` drives the two bundlers, plus `ElectronLauncher` in dev.

Layering under `src/`:

- `application/` — `BuildCommand`, `DevCommand` (set `NODE_ENV`, wire bundlers)
- `domain/contracts/` — interfaces (`BundlerInterface`, `ConfigLoaderInterface`, `ElectronLauncherInterface`, `LoggerInterface`)
- `domain/services/` — `BuildOrchestrator` (pure, no infrastructure imports)
- `domain/value-objects/` — `AppConfig`, `MainConfig`, `RendererConfig` (Zod schemas, frozen instances)
- `infrastructure/` — `ConfigLoader`, `ElectronLauncher` (tinyexec), `PinoLogger`, `bundlers/`
- `errors/` — `ElectronTsdownError` base + `ConfigError`, `BundleError`, `LaunchError`; `run.ts` prints these and exits 1, anything else rethrows

Config is loaded from `electron-tsdown.config.{ts,js}` via unconfig. `defineConfig()` is the sole library export (`src/index.ts`).

In dev, `TsdownBundler` runs tsdown in watch mode and restarts Electron from the `build:done` hook (debounced 200ms); `ViteBundler` starts a Vite dev server.

#### tsdown coupling

`TsdownBundler.#toInlineConfig()` merges its own options into the user's `tsdown.config`, and forces:

- `deps.neverBundle: true` — externalize `node_modules`. tsdown throws if the user's own config also sets the deprecated `deps.skipNodeModulesBundle`.
- `dts: false` — tsdown auto-enables dts from `package.json` types or tsconfig `declaration`; a main process bundle never needs it.
- `outExtensions` → `.js`, `logLevel: 'warn'`.

`tsdown` and `vite` are **peer dependencies**. Bumping the tsdown peer range is a breaking change for consumers — release a major and document the migration in the changeset.

### `@electron-tsdown/create-app` (packages/create-app)

Scaffolding CLI (`npm init @electron-tsdown/app`). `enquirer` prompts → picks a dir from `templates/` (`react-vite`, `react-vite-ts`) → installs deps with the detected package manager.

Templates are shipped as-is in the published tarball (`files: ["dist", "templates"]`), so their `package.json` and `tsdown.config` must stay consistent with the `electron-tsdown` version being released.

## Tooling

- **Build:** `tsc -b` then `tsdown` (bundles to `dist/`)
- **Lint:** oxlint (`oxlint.config.ts` at the root; templates are ignored)
- **Format:** oxfmt (`oxfmt.config.ts` at the root, re-exported by each package; 80 cols, single quotes, no semis, trailing commas). `CHANGELOG.md` is ignored — oxfmt otherwise rewrites the changesets-generated files.
- **Git hooks:** lefthook (`lefthook.yml`), formats and lints staged files per package
- **Node:** `electron-tsdown` requires `^22.18.0 || >=24.11.0` (tsdown 0.22's floor); pinned to 24 via `.nvmrc` and CI
- **pnpm:** v12, pinned by the root `packageManager` field
- **CI:** `.github/workflows/ci.yaml` on every PR — lint, format, build, plus a job per template that scaffolds it against a packed `electron-tsdown` tarball and runs `typecheck` + `build`. `scripts/` is covered by neither oxlint nor oxfmt (both only run through `pnpm -r`).

## Release

Changesets, published from `main` by `.github/workflows/on-release.yaml` with npm
OIDC provenance.

Add a changeset file to `.changeset/` when changing a published package:

```md
---
'electron-tsdown': patch
---

Description.
```

Use `"@electron-tsdown/create-app"` for the create-app package.

The two packages are `fixed` in `.changeset/config.json`, so they always share a
version number. That is deliberate: the templates carry a hard-coded
`electron-tsdown` range that changesets cannot see, so releasing the CLI must
also republish create-app for the updated template to reach users.

`changeset:version` runs `scripts/sync-template-deps.mjs` after `changeset
version`. It rewrites each template's `electron-tsdown` range to `^<version>`
using the version changesets just bumped — which is the version `changeset
publish` is about to release. Never edit that range by hand: a range written
before the bump can name a version that is never published, and every scaffolded
app then fails to install.
