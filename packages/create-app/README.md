# @electron-tsdown/create-app

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Kiyozz/electron-tsdown/blob/HEAD/LICENSE)
[![@electron-tsdown/create-app version](https://img.shields.io/npm/v/@electron-tsdown/create-app.svg)](./CHANGELOG.md)

The easiest way to get started with tsdown/vite in Electron by using `@electron-tsdown/create-app`. This simple CLI tool enables you to quickly start building a new Electron application.

With pnpm:

    pnpm create @electron-tsdown/app

With npm:

    npm init @electron-tsdown/app

With yarn:

    yarn create @electron-tsdown/app

## Options

`@electron-tsdown/create-app` comes with the following options:

- -t, --template use template
- -p, --package-manager use this package manager [npm, pnpm, yarn]
- -o, --override remove existing output folder
- --version prints version
- --help show help

## Supported templates

- `react-vite`
- `react-vite-ts`
