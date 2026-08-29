---
'@electron-tsdown/create-app': patch
---

Drop the `main`, `main-ts`, `svelte` and `svelte-ts` entries from the `Template`
enum. No such template directory ships with the package, and only `react-vite`
and `react-vite-ts` were ever accepted by `isTemplateValid`.
