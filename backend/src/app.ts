import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { pinoHttp } from 'pino-http'
import { env, clientOrigins } from './config/env.js'
import { logger } from './config/logger.js'
import { sessionMiddleware } from './config/session.js'
import { passport } from './config/passport.js'
import { verifyRequestOrigin } from './common/middleware/verify-origin.js'
import { errorHandler, notFoundHandler } from './common/middleware/error-handler.js'
import { apiRouter } from './routes.js'
export const createApp = () => {
  const app = express()
  app.disable('x-powered-by')
  if (env.NODE_ENV === 'production') app.set('trust proxy', 1)
  app.use(pinoHttp({ logger, autoLogging: false }))
  app.use(helmet())
  app.use(cors({ origin: clientOrigins, credentials: true }))
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())
  app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-8' }))
  app.use(verifyRequestOrigin)
  app.use(sessionMiddleware)
  app.use(passport.initialize())
  app.use(passport.session())
  app.use('/api', apiRouter)
  app.use(notFoundHandler)
  app.use(errorHandler)
  return app
}
