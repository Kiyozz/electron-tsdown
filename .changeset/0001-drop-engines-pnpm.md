---
'electron-tsdown': patch
'@electron-tsdown/create-app': patch
---

Drop the `engines.pnpm` constraint. It pinned consumers to pnpm 10 for no
reason.
