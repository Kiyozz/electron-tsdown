import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['typescript', 'import'],
  env: { node: true },
  ignorePatterns: ['packages/create-app/templates/**', 'packages/**/dist/**'],
  rules: {
    'typescript/no-unused-vars': ['warn', { ignoreRestSiblings: true }],
    'typescript/no-var-requires': 'error',
    'import/no-cycle': 'error',
    'import/default': 'error',
    'import/exports-last': 'error',
    'import/first': 'error',
  },
})
