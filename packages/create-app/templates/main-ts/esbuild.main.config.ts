import type { BuildOptions } from 'esbuild'
import * as path from 'node:path'

const main: BuildOptions = {
  platform: 'node',
  entryPoints: [path.resolve('src/main/main.ts')],
  bundle: true,
  format: 'esm',
  target: 'node20.11.1', // electron version target
}

const preload: BuildOptions = {
  platform: 'node',
  entryPoints: [path.resolve('src/main/preload.ts')],
  bundle: true,
  format: 'esm',
  target: 'node20.11.1', // electron version target
  // it is important to use .mjs extension for preload script because of how electron load preload script
  outExtension: {
    '.js': '.mjs',
  },
}

export default [main, preload]
