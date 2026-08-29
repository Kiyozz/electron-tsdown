import { defineConfig } from 'oxfmt'

export default defineConfig({
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  endOfLine: 'lf',
  ignorePatterns: [
    '**/CHANGELOG.md',
    'packages/create-app/var',
    'packages/**/dist',
  ],
})
