import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/**/*.ts'],
  sourcemap: true,
  clean: true,
  format: 'esm',
  outExtensions: () => ({ js: '.js' }),
  target: 'node24.14', // electron 41
  tsconfig: './tsconfig.app.json',
  dts: true,
  deps: {
    onlyBundle: [],
  },
})
