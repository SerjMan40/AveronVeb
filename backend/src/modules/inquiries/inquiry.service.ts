import { createHash } from 'node:crypto'
import mongoose from 'mongoose'
import { AppError } from '../../common/errors/app-error.js'
import { env } from '../../config/env.js'
import { Inquiry } from './inquiry.model.js'
import type { InquirySubmission } from './inquiry.schema.js'
import { telegramConfigured } from './inquiry.telegram.js'

export async function saveInquiry(submission: InquirySubmission) {
  if (submission.website.trim()) return

  if (mongoose.connection.readyState !== 1) {
    throw new AppError(503, 'DATABASE_UNAVAILABLE', 'Inquiry storage is temporarily unavailable')
  }

  const { name, email, company, message, service, locale } = submission
  const fingerprint = createHash('sha256')
    .update(JSON.stringify([name, email.toLowerCase(), company, message, service]))
    .digest('hex')

  try {
    await Inquiry.create({
      name, email, company, message, service, locale, fingerprint,
      ...(telegramConfigured ? { telegramNotification: {} } : {}),
      expiresAt: new Date(Date.now() + env.INQUIRY_RETENTION_DAYS * 86_400_000),
    })
  } catch (error) {
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) return
    if (error instanceof mongoose.mongo.MongoNetworkError ||
        error instanceof mongoose.mongo.MongoServerSelectionError ||
        mongoose.connection.readyState !== 1) {
      throw new AppError(503, 'DATABASE_UNAVAILABLE', 'Inquiry storage is temporarily unavailable')
    }
    throw error
  }
}
