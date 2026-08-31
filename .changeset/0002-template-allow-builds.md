---
'@electron-tsdown/create-app': patch
---

Add `pnpm-workspace.yaml` to the templates so `pnpm install` works on pnpm 12,
which fails the install when a dependency's build script is neither allowed nor
ignored.
