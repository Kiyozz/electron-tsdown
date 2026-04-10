# electron-tsdown

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Kiyozz/electron-tsdown/blob/HEAD/LICENSE)
[![electron-tsdown version](https://img.shields.io/npm/v/electron-tsdown.svg?label=%20)](./CHANGELOG.md)

## Getting Started

With pnpm:

    pnpm create @electron-tsdown/app

With npm:

    npm init @electron-tsdown/app

With yarn:

    yarn create @electron-tsdown/app

**All configurations are already setup for you.**

Start a development build

```shell
npm run dev
```

All arguments after `--` will be pass through the electron process.

```shell
electron-tsdown dev -- --remote-debugging-port
```

- `--remote-debugging-port=9229` will start the devtools to the port 9229
- `--remote-debugging-port` will start the devtools to a free port
- `--inspect=9230` will start the inspector to the port 9230
- `--inspect` will start the inspector to a free port

Create a build

```shell
npm run build
```

Package the app

```shell
npm run package
```

## Development

Refer to [README](../../README.md)
