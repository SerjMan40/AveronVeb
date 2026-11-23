import { createApp } from './app.js'
import { connectDatabase, disconnectDatabase } from './config/database.js'
import { env } from './config/env.js'
import { logger } from './config/logger.js'
const start = async () => {
  await connectDatabase()
  const server = createApp().listen(env.PORT, () => logger.info({ port: env.PORT }, 'API server started'))
  const shutdown = (signal: string) => { logger.info({ signal }, 'Graceful shutdown started'); server.close(() => void disconnectDatabase().then(() => process.exit(0))) }
  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}
start().catch((error: unknown) => { logger.fatal({ error }, 'Failed to start API server'); process.exit(1) })
