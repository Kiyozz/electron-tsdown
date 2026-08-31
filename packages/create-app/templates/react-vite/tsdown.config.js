import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/main/main.js', 'src/main/preload.js'],
  platform: 'node',
  format: 'esm',
  target: 'node24.18', // electron version target
  logLevel: 'error',
  outDir: 'dist/main',
  unbundle: false,
})
