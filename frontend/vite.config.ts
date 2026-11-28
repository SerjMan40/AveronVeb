import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

import { apiHealth } from './config/plugins/apiHealth.ts'
import { prerender } from './config/plugins/prerender.ts'

const apiTarget = 'http://localhost:4000'

export default defineConfig(({ mode, isPreview }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const configuredUrl = env.AVERON_SITE_URL?.trim()
  let origin: string | undefined
  if (configuredUrl) {
    const url = URL.parse(configuredUrl)
    if (!url || url.protocol !== 'https:' || url.href !== `${url.origin}/`) {
      throw new Error('AVERON_SITE_URL must be a valid HTTPS origin')
    }
    origin = url.origin
  }

  return {
    appType: isPreview ? 'mpa' : 'spa',
    define: { 'import.meta.env.AVERON_SITE_URL': JSON.stringify(origin ?? '') },
    plugins: [
      react(),
      apiHealth(apiTarget),
      prerender(origin),
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
