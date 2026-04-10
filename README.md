# electron-tsdown

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Kiyozz/electron-tsdown/blob/HEAD/LICENSE)
![electron-tsdown version](https://img.shields.io/npm/v/electron-tsdown.svg?label=%20)
![github-actions](https://github.com/Kiyozz/electron-tsdown/workflows/CI/badge.svg)
![electron-tsdown downloads](https://img.shields.io/npm/dm/electron-tsdown.svg)

Easily integrate `tsdown`/`vite` for your Electron environment.

## Features

- Use of `tsdown` for main source code building
- Use of `vite` for renderer source code building
- HMR for `renderer` and `main` processes
- Full control of your tsdown configuration
- Full control of your vite configuration
- Use electron-builder for final package

## [Getting Started](packages/electron-tsdown/README.md)

## Packages

| Package                                            | Version                                                                                                                           |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [electron-tsdown](packages/electron-tsdown)       | [![electron-tsdown version](https://img.shields.io/npm/v/electron-tsdown.svg?label=%20)](packages/electron-tsdown/CHANGELOG.md) |
| [@electron-tsdown/create-app](packages/create-app) | [![create-app version](https://img.shields.io/npm/v/@electron-tsdown/create-app.svg?label=%20)](packages/create-app/CHANGELOG.md) |

## Development

This repository uses node@24 and pnpm workspaces.

```shell
pnpm i
```
