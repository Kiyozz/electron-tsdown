import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/**/*.ts'],
  sourcemap: true,
  clean: true,
  format: 'esm',
  outExtensions: () => ({ js: '.js' }),
  target: 'node22.18', // lowest supported node, see `engines`
  tsconfig: './tsconfig.app.json',
  dts: true,
  deps: {
    onlyBundle: [],
  },
})
