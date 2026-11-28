import { setTimeout as delay } from 'node:timers/promises'
import type { Plugin } from 'vite'

export function apiHealth(proxyTarget: string): Plugin {
  return {
    name: 'api-health',
    apply: 'serve',
    configureServer(server) {
      const httpServer = server.httpServer
      if (!httpServer) return

      const shutdown = new AbortController()
      httpServer.once('close', () => shutdown.abort())
      httpServer.once('listening', () => {
        const address = httpServer.address()
        if (!address || typeof address === 'string') return

        const host = address.address === '::' ? '[::1]'
          : address.address === '0.0.0.0' ? '127.0.0.1'
          : address.family === 'IPv6' ? `[${address.address}]`
          : address.address
        const proxyHealth = `http://${host}:${address.port}/api/health`
        const logger = server.config.logger

        async function check() {
          const signal = AbortSignal.any([shutdown.signal, AbortSignal.timeout(12_000)])
          try {
            // Wait for concurrent API startup before using the proxy, which logs failed requests.
            while (!signal.aborted) {
              const upstream = await fetch(`${proxyTarget}/api/health`, { signal }).catch(() => null)
              await upstream?.body?.cancel()
              if (upstream?.ok) break
              await delay(500, undefined, { signal })
            }

            const response = await fetch(proxyHealth, { signal })
            const health = await response.json()
            if (!response.ok || health?.status !== 'ok') {
              logger.warn('[api] /api/health did not report a ready backend.')
              return
            }

            if (health.database === 'connected') {
              logger.info('[api] Frontend → backend OK. MongoDB connected.')
            } else {
              logger.warn('[api] Frontend → backend OK. MongoDB is not connected.')
            }
          } catch {
            if (!shutdown.signal.aborted) {
              logger.warn('[api] Backend health check failed. Check the backend terminal output and port 4000.')
            }
          }
        }

        void check()
      })
    },
  }
}
