import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    // In development, calls to /api go to the backend (npm run dev in the backend folder).
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
})
