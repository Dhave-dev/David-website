import { defineConfig } from 'vite'
import { sanityPlugin } from 'vite-plugin-sanity'

export default defineConfig({
  plugins: [sanityPlugin()],
  server: { port: 3333 },
})
