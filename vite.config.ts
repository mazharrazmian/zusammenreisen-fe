// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // English version (default)
        main: resolve(__dirname, 'index.html'),
        // German version
        zusammenreisen: resolve(__dirname, 'index-zusammenreisen.html')
      }
    }
  }
})

