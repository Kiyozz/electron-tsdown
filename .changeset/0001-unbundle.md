---
'@electron-tsdown/create-app': patch
---

Fix unbundle in templates. It was set to true instead of false, which caused that no dependencies were bundled.
