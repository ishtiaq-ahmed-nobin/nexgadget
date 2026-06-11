import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const backendTarget = process.env.BACKEND_TARGET || 'http://localhost'
const backendPath = process.env.BACKEND_PATH || '/idb-project/NexGadget/backend'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: backendTarget,
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            const url = new URL(req.url || '/', backendTarget)
            const qs = url.searchParams.toString()
            proxyReq.path = backendPath + '/index.php?_url=' + encodeURIComponent(url.pathname) + (qs ? '&' + qs : '')
          })
        },
      },
      '/uploads': {
        target: backendTarget,
        rewrite: (path) => backendPath + path,
      },
    },
  },
})
