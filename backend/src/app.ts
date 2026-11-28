import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { clientOrigins, env } from './config/env.js'
import { verifyRequestOrigin } from './common/middleware/verify-origin.js'
import { errorHandler, notFoundHandler } from './common/middleware/error-handler.js'
import { createApiRouter } from './routes.js'

export function createApp() {
  const app = express()
  app.disable('x-powered-by')
  app.set('trust proxy', env.TRUST_PROXY_HOPS)
  app.use(helmet())
  app.use(cors({ origin: clientOrigins }))
  app.use(verifyRequestOrigin)
  app.use('/api', createApiRouter())
  app.use(notFoundHandler)
  app.use(errorHandler)
  return app
}
