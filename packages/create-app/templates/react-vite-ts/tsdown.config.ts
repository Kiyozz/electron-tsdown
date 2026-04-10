import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/main/main.ts', 'src/main/preload.ts'],
  platform: 'node',
  format: 'esm',
  target: 'node24.14', // electron version target
  logLevel: 'error',
  outDir: 'dist/main',
  unbundle: true,
  deps: {
    skipNodeModulesBundle: true,
  },
})
