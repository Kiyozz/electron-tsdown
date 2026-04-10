# My App

> Bootstrapped with [electron-tsdown](https://github.com/Kiyozz/electron-tsdown) — Electron + React + Vite + TypeScript

## Stack

- [Electron](https://www.electronjs.org/) — desktop shell
- [React](https://react.dev) — UI framework
- [Vite](https://vitejs.dev) — renderer bundler with HMR
- [tsdown](https://tsdown.dev) — main process bundler
- [TypeScript](https://www.typescriptlang.org/) — type safety

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command   | Description                           |
| --------- | ------------------------------------- |
| `dev`     | Start in development mode with HMR    |
| `build`   | Build for production                  |
| `package` | Package the app with electron-builder |

## Project structure

```
src/
├── main/
│   ├── main.ts       # Electron main process
│   └── preload.ts    # Preload script
└── renderer/
    ├── App.tsx       # Root React component
    ├── index.html
    ├── index.tsx     # React entry point
    └── vite.config.ts
electron-tsdown.config.ts   # electron-tsdown configuration
tsdown.config.ts            # tsdown (main process) configuration
```
