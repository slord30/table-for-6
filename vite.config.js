import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Points to the two HTML files in your root
        main: resolve(__dirname, 'index.html'),
        favorites: resolve(__dirname, 'favorites.html'),
      },
    },
  },
})
