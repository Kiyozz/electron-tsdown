import * as path from 'node:path'

/** @var {import('esbuild').BuildOptions} */
const main = {
  platform: 'node',
  entryPoints: [path.resolve('src/main/main.js')],
  bundle: true,
  format: 'esm',
  target: 'node20.11.1', // electron version target
}

/** @var {import('esbuild').BuildOptions} */
const preload = {
  platform: 'node',
  entryPoints: [path.resolve('src/main/preload.js')],
  bundle: true,
  format: 'esm',
  target: 'node20.11.1', // electron version target
  // it is important to use .mjs extension for preload script because of how electron load preload script
  outExtension: {
    '.js': '.mjs',
  },
}

export default [main, preload]
