---
'electron-tsdown': minor
---

`defineConfig()` is now generic (`<T extends AppConfigInput>(config: T): T`), so
it returns the exact config object type instead of widening it to
`AppConfigInput`.

The package entry used to declare its own non-generic copy of `defineConfig`,
shadowing the generic one in `src/define-config.ts` — which was compiled and
published but unreachable, since `exports` only maps `.`. The entry now
re-exports the generic implementation, and `AppConfigInput` is exported as a type.
