import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,

    proxy: {
      '/n8n': {
        target: 'http://localhost:5678',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/n8n/, '/webhook'),
      },
    },
  },
})