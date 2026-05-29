import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
