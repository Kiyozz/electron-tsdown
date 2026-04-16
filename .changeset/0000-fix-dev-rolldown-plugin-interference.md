---
"electron-tsdown": patch
---

Use tsdown `build:done` hook instead of rolldown `writeBundle` plugin for electron restart in dev mode. Avoids inline plugins merging with user config plugins, which could interfere with rolldown plugin initialization (e.g. babel macro transforms).
