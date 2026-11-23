import { Router } from 'express'
import mongoose from 'mongoose'
import { env } from '../../config/env.js'

export const healthRouter = Router()
healthRouter.get('/', (_request, response) => response.json({
  status: 'ok',
  database: !env.MONGODB_URI ? 'disabled' : mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
}))
