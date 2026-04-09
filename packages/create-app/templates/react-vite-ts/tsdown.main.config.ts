import { defineConfig } from 'tsdown'

const main = defineConfig({
  entry: ['src/main/main.ts'],
  platform: 'node',
  format: 'esm',
  target: 'node24.14', // electron version target
  outExtensions: () => ({ js: '.js' }),
  logLevel: 'error',
})

const preload = defineConfig({
  entry: ['src/main/preload.ts'],
  platform: 'node',
  format: 'esm',
  target: 'node24.14',
  // it is important to use .mjs extension for preload script because of how electron load preload script
  outExtensions: () => ({ js: '.js' }),
  logLevel: 'error',
})

export default [main, preload]
