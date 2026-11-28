import { once } from 'node:events'
import { createApp } from './app.js'
import { connectDatabase, disconnectDatabase } from './config/database.js'
import { env } from './config/env.js'
import { logger } from './config/logger.js'
import { startInquiryWorker } from './modules/inquiries/inquiry.worker.js'

async function start() {
  try {
    await connectDatabase()
  } catch (error) {
    logger.fatal(error instanceof Error ? error.message : 'MongoDB initialization failed')
    process.exit(1)
  }
  const server = createApp().listen(env.PORT)
  await once(server, 'listening')
  logger.info({ port: env.PORT }, 'API server started')
  const stopWorker = startInquiryWorker()
  let stopping = false

  async function shutdown() {
    if (stopping) return
    stopping = true
    logger.info('Graceful shutdown started')
    const timeout = setTimeout(() => process.exit(1), 25_000).unref()
    try {
      await Promise.all([
        new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())),
        stopWorker(),
      ])
      await disconnectDatabase()
      clearTimeout(timeout)
    } catch {
      logger.error('Graceful shutdown failed')
      process.exit(1)
    }
  }

  process.on('SIGINT', () => void shutdown())
  process.on('SIGTERM', () => void shutdown())
}

start().catch((error: unknown) => {
  const portInUse = error instanceof Error && 'code' in error && error.code === 'EADDRINUSE'
  logger.fatal({ port: env.PORT }, portInUse ? 'API port is already in use' : 'API failed to start listening')
  process.exit(1)
})
