import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/main/main.js', 'src/main/preload.js'],
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
