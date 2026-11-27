import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

import { localeSitemap } from './config/plugins/localeSitemap.ts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      localeSitemap(env.AVERON_SITE_URL),
    ],

    server: {
      host: true,
      open: true,

      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
  }
})
