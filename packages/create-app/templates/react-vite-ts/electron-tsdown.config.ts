import { defineConfig } from 'electron-tsdown'

export default defineConfig({
  main: {
    tsdown: {
      path: 'tsdown.config.ts',
      outDir: 'dist/main',
      outFile: 'main.js',
    },
  },
  renderer: {
    vite: {
      path: 'src/renderer/vite.config.ts',
      root: 'src/renderer',
      outDir: 'dist/renderer',
    },
  },
})
