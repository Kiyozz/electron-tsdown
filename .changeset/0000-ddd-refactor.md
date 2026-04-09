---
'electron-esbuild': major
---

Refactor to DDD architecture with IoC container.

- Replace `meow` CLI with `cac`
- Replace `child_process.spawn` with `tinyexec` for electron
- Add `pino` + `pino-pretty` logger
- Add `@adonisjs/fold` IoC container
- New config format: single `electron-esbuild.config.ts` with `defineConfig({ main: { configs, output }, renderer: { configFile, output } })`
- Remove YAML config support
- `renderer` is now required (no longer optional)
