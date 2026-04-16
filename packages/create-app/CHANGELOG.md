## 10.0.2

### Patch Changes

- da2c01f: Update dependencies

## 10.0.1

### Patch Changes

- 6d7c5ab: All templates were missing "electron-tsdown" as a dependency.

## 10.0.0

### Major Changes

- 692c884: Replace esbuild with tsdown for main process bundling.
- 1a954f0: Rename packages from `electron-esbuild` / `@electron-esbuild/create-app` to `electron-tsdown` / `@electron-tsdown/create-app`.
- 692c884: Remove some templates for maintainability. The only templates supported now are `react-vite` and `react-vite-ts`.

### Patch Changes

- 284f320: Migrate linting/formatting/git hooks from ESLint+Prettier+husky+lint-staged to oxlint+oxfmt+lefthook.

## 9.2.0

Updated templates for latest electron versions.

## 9.0.0

### Breaking Changes

- change to pure ESM
- remove esbuild as renderer bundler

### Changes

- Updated all templates for latest electron versions.

## 8.0.0

### Breaking Changes

- require node@18.15.0 to be synchronized with electron@25.0.0
- support for esbuild@0.18 ([#53](https://github.com/Kiyozz/electron-tsdown/pull/53), thanks to [@jonluca](https://github.com/jonluca))

## v4.0.1

### Breaking Changes

- templates updated for vite@4

### Bug fixes

- Fixed templates with the latest version of electron-tsdown

## v3.0.0

**react-ts-webpack** template removed.

## v2.0.3

**react-ts-webpack** template deprecated. Will be removed in v3.

### Changes

- Update templates

## v2.0.2

### Bug fixes

- Fix react, react-ts template with css files (#35)

## v2.0.1

### Bug fixes

- Fix: dirname

## v2.0.0

### Breaking changes

- Require Node.js 14
- This package is now pure ESM (because @electron-tsdown/create-app is mainly a cli, this should work out of the box).
  Please [read this](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

### Changes

- Update templates

## v1.8.1

### Bug fixes

- Fix react-ts-webpack template.

## v1.8.0

### Features

- Update dependencies
- Update templates

## v1.7.0

### Features

- Updated dependencies
- Updated templates to reflect new version of electron-tsdown

## v1.6.1

### Bug fixes

- Invalid esbuild loader for `svelte-ts` template

## v1.6.0

### Features

- New template `svelte-ts` using [vite](https://github.com/vitejs/vite)
- New template `react-vite` using [vite](https://github.com/vitejs/vite)
- New template `react-vite-ts` using [vite](https://github.com/vitejs/vite)

## v1.5.0

### Features

- New template `svelte` using [vite](https://github.com/vitejs/vite)

## v1.4.2

### Bug fixes

- Fix -p flag

## v1.4.1

### Features

- Cli is now interactive
- Dependencies are now longer preinstalled

## v1.3.1

### Bug fixes

- Fixes electron-builder config in main-only-typescript, main-only-javascript templates

## v1.3.0

### Features

- Add main-only-typescript template
- Add main-only-javascript template

### Bug fixes

- react-typescript-webpack template was missing webpack-dev-server

## v1.2.1

### Bug fixes

- Missing esbuild in devDependencies

## v1.2.0

### Bug fixes

- Update for new esbuild config format
