import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

import { apiHealth } from './config/plugins/apiHealth.ts'
import { localeSitemap } from './config/plugins/localeSitemap.ts'

const apiTarget = 'http://localhost:4000'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      apiHealth(apiTarget),
      localeSitemap(env.AVERON_SITE_URL),
    ],

    server: {
      host: true,
      open: true,

      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
