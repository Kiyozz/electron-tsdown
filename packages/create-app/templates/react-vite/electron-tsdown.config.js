import { defineConfig } from 'electron-esbuild'

export default defineConfig({
  main: {
    tsdown: {
      path: 'tsdown.config.js',
      outDir: 'dist/main',
      outFile: 'main.js',
    },
  },
  renderer: {
    vite: {
      path: 'src/renderer/vite.config.js',
      root: 'src/renderer',
      outDir: 'dist/renderer',
    },
  },
})
