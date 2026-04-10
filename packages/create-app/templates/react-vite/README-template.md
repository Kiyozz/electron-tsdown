# My App

> Bootstrapped with [electron-tsdown](https://github.com/Kiyozz/electron-tsdown) — Electron + React + Vite

## Stack

- [Electron](https://www.electronjs.org/) — desktop shell
- [React](https://react.dev) — UI framework
- [Vite](https://vitejs.dev) — renderer bundler with HMR
- [tsdown](https://tsdown.dev) — main process bundler

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
│   ├── main.js       # Electron main process
│   └── preload.js    # Preload script
└── renderer/
    ├── App.jsx       # Root React component
    ├── index.html
    ├── index.jsx     # React entry point
    └── vite.config.js
electron-tsdown.config.js   # electron-tsdown configuration
tsdown.config.js            # tsdown (main process) configuration
```
