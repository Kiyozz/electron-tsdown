---
'electron-tsdown': major
'@electron-tsdown/create-app': major
---

Require tsdown 0.23. The `tsdown` peer dependency moves from `^0.22.0` to `^0.23.0`, and Node 25 is no longer supported (tsdown 0.23 accepts `^22.18.0 || ^24.11.0 || >=26.0.0`).

Migration: in your app, bump `tsdown` to `^0.23.7` alongside `electron-tsdown`. No `electron-tsdown.config` or `tsdown.config` change is needed.

The templates now scaffold Electron 45, React 19.3, Vite 8.3, `@vitejs/plugin-react` 6.3 and electron-builder 26.18.
