import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/control',
  plugins: [react()],
  server: {
    proxy: {
      '/-': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    }
  },
})
