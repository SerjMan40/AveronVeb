import mongoose from 'mongoose'
import { Inquiry } from '../modules/inquiries/inquiry.model.js'
import { env } from './env.js'
import { logger } from './logger.js'

function connectionFailure(error: unknown) {
  if (!(error instanceof Error)) return 'Check the MongoDB connection settings.'
  const code = 'code' in error ? error.code : undefined

  if (/querySrv|queryTxt/i.test(error.message)) {
    return 'MongoDB Atlas DNS lookup failed. Check that the cluster is active and your DNS resolver can resolve its SRV and TXT records.'
  }
  if (code === 18 || /authentication failed|bad auth/i.test(error.message)) {
    return 'MongoDB authentication failed. Check the database user, password and URI encoding.'
  }
  if (error.name === 'MongoParseError') {
    return 'MongoDB URI is invalid. Check its format and percent-encoding.'
  }
  if (error instanceof mongoose.Error.MongooseServerSelectionError) {
    return 'MongoDB servers did not respond. Check the Atlas IP access list and outbound network access.'
  }
  return 'Check the MongoDB connection settings.'
}

export async function connectDatabase() {
  if (!env.MONGODB_URI) {
    logger.warn('MongoDB is not configured')
    return
  }

  logger.info('Connecting to MongoDB')
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      autoIndex: false,
    })
  } catch (error) {
    throw new Error(connectionFailure(error))
  }

  try {
    await Inquiry.createIndexes()
  } catch {
    throw new Error('MongoDB connected but inquiry indexes could not be created. Check the database user permissions and existing indexes.')
  }
  logger.info('Database connected')
}

export async function disconnectDatabase() {
  await mongoose.disconnect()
}
