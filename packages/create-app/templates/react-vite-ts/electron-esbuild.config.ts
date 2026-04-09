import { defineConfig as tsdownConfig } from 'tsdown'

import { defineConfig } from 'electron-esbuild'

export default defineConfig({
  main: {
    configs: [
      tsdownConfig({
        entry: ['src/main/main.ts'],
        platform: 'node',
        format: 'esm',
        target: 'node24.14', // electron version target
        outExtensions: () => ({ js: '.js' }),
        logLevel: 'error',
      }),
      tsdownConfig({
        entry: ['src/main/preload.ts'],
        platform: 'node',
        format: 'esm',
        target: 'node24.14',
        outExtensions: () => ({ js: '.js' }),
        logLevel: 'error',
      }),
    ],
    output: { dir: 'dist/main', filename: 'main.js' },
  },
  renderer: {
    configFile: 'src/renderer/vite.config.ts',
    output: { dir: 'dist/renderer' },
  },
})
