---
'electron-tsdown': patch
---

Forward extra `dev` arguments to the electron process again. Both
`electron-tsdown dev -- --remote-debugging-port=9222` and
`electron-tsdown dev --remote-debugging-port=9222` now work.
