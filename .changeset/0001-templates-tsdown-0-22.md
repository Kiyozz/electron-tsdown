---
'@electron-tsdown/create-app': minor
---

Update templates: `tsdown` 0.22, `electron-tsdown` 12, Electron 44,
`electron-builder` 26.15, Vite 8.2, React 19.2.8 and TypeScript 7 (TS template).

`deps.skipNodeModulesBundle` is gone from the generated `tsdown.config` —
electron-tsdown externalizes `node_modules` itself, and tsdown 0.22 throws when
both that option and `deps.neverBundle` are set. Build target follows Electron
44's Node (`node24.18`).

Fix the TypeScript template's `tsc -b`, which failed on
`src/renderer/vite.config.ts` with `TS9037` because `tsconfig.app.json` pulled it
in alongside `tsconfig.node.json` under `isolatedDeclarations`. The two projects
are now split by process — `tsconfig.app.json` covers the renderer (with `jsx`
and the DOM libs, so `.tsx` files are finally type-checked) and
`tsconfig.node.json` covers the main process and the config files. Templates also
ship a `typecheck` script.
