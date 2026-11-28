import { Router } from 'express'
import mongoose from 'mongoose'
import { env } from '../../config/env.js'

export const healthRouter = Router()

healthRouter.get('/', (_request, response) => {
  const connected = mongoose.connection.readyState === 1
  const healthy = connected || !env.MONGODB_URI
  response.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'unavailable',
    database: connected ? 'connected' : env.MONGODB_URI ? 'disconnected' : 'disabled',
  })
})
