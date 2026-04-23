import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/weatherforecast': {
        target: process.env['services__api__https__0'] ?? process.env['services__api__http__0'] ?? 'http://localhost:5545',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
