import { model, Schema, type HydratedDocument, type InferSchemaType } from 'mongoose'

const notificationSchema = new Schema({
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  attempts: { type: Number, default: 0 },
  nextAttemptAt: { type: Date, default: Date.now },
  leaseUntil: { type: Date, default: () => new Date(0) },
  leaseToken: String,
  firstAttemptAt: Date,
  sentAt: Date,
}, { _id: false })

const schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, default: '' },
  message: { type: String, required: true },
  service: { type: String, required: true },
  locale: { type: String, required: true },
  fingerprint: { type: String, required: true, unique: true },
  status: { type: String, enum: ['new', 'in_progress', 'closed'], default: 'new' },
  expiresAt: { type: Date, required: true, expires: 0 },
  notification: { type: notificationSchema, default: () => ({}) },
  telegramNotification: notificationSchema,
}, { timestamps: true, bufferCommands: false })

schema.index({ 'notification.status': 1, 'notification.nextAttemptAt': 1 })
schema.index({ 'telegramNotification.status': 1, 'telegramNotification.nextAttemptAt': 1 }, {
  partialFilterExpression: { 'telegramNotification.status': 'pending' },
})

export type InquiryDocument = HydratedDocument<InferSchemaType<typeof schema>>
export const Inquiry = model('Inquiry', schema)
