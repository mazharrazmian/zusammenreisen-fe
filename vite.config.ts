import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',  // or 'jsdom' if you prefer
    globals: true,             // allows using `describe`, `it`, etc. without imports
  },
})
