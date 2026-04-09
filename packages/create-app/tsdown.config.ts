import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/**/*.ts'],
  sourcemap: true,
  clean: true,
  format: 'esm',
  outExtensions: () => ({ js: '.js' }),
  target: 'node22',
  tsconfig: './tsconfig.app.json',
  dts: false,
  deps: {
    onlyBundle: [],
  },
})
