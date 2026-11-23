import mongoose from 'mongoose'
import { env } from './env.js'
import { logger } from './logger.js'

export const connectDatabase = async () => {
  if (!env.MONGODB_URI) {
    logger.warn('MongoDB is not configured; starting without persistent sessions')
    return false
  }

  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: env.NODE_ENV === 'development' ? 5000 : 30000,
    })
    logger.info('Database connected')
    return true
  } catch (error) {
    if (env.NODE_ENV !== 'development') throw error
    logger.warn({ errorName: error instanceof Error ? error.name : 'UnknownError' }, 'MongoDB is unavailable; starting in development mode without persistent sessions')
    return false
  }
}

export const disconnectDatabase = async () => {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect()
}
