import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import sveltePreprocess from 'svelte-preprocess'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte({ preprocess: sveltePreprocess() })],
  build: {
    target: 'chrome124', // electron version target
  },
  server: {
    port: 9080,
  },
})
