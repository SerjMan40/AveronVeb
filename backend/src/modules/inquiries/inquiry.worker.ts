import { randomUUID } from 'node:crypto'
import mongoose from 'mongoose'
import { logger } from '../../config/logger.js'
import { mailConfigured, sendInquiryMail } from './inquiry.mail.js'
import { Inquiry, type InquiryDocument } from './inquiry.model.js'
import { sendInquiryTelegram, telegramConfigured } from './inquiry.telegram.js'

const retryMinutes = [1, 5, 30, 120, 240]
const maxRetryAgeMs = 12 * 60 * 60_000

interface DeliveryResult {
  status: 'sent' | 'retry' | 'failed'
  code?: number
  retryAfterSeconds?: number
}

interface NotificationChannel {
  name: 'email' | 'telegram'
  field: 'notification' | 'telegramNotification'
  enabled: boolean
  send: (inquiry: InquiryDocument) => Promise<DeliveryResult>
}

const channels: NotificationChannel[] = [
  {
    name: 'email',
    field: 'notification',
    enabled: mailConfigured,
    send: async inquiry => ({ status: await sendInquiryMail(inquiry) }),
  },
  {
    name: 'telegram',
    field: 'telegramNotification',
    enabled: telegramConfigured,
    send: sendInquiryTelegram,
  },
]

async function processNotification(channel: NotificationChannel) {
  const { field } = channel
  const now = new Date()
  const leaseToken = randomUUID()
  const inquiry = await Inquiry.findOneAndUpdate({
    [`${field}.status`]: 'pending',
    [`${field}.nextAttemptAt`]: { $lte: now },
    [`${field}.leaseUntil`]: { $lte: now },
    expiresAt: { $gt: now },
  }, {
    $set: {
      [`${field}.leaseToken`]: leaseToken,
      [`${field}.leaseUntil`]: new Date(now.getTime() + 60_000),
    },
    $inc: { [`${field}.attempts`]: 1 },
  }, {
    sort: { [`${field}.nextAttemptAt`]: 1 },
    returnDocument: 'after',
  })

  const notification = inquiry?.[field]
  if (!inquiry || !notification) return false

  const owned = { _id: inquiry._id, [`${field}.leaseToken`]: leaseToken }
  const { attempts } = notification
  const firstAttemptAt = notification.firstAttemptAt ?? now
  let result: DeliveryResult = { status: 'failed' }

  if (attempts <= retryMinutes.length + 1 && now.getTime() - firstAttemptAt.getTime() < maxRetryAgeMs) {
    const lease = await Inquiry.updateOne(owned, { $set: { [`${field}.firstAttemptAt`]: firstAttemptAt } })
    if (!lease.matchedCount) return true
    result = await channel.send(inquiry)
  }

  const backoff = retryMinutes[attempts - 1]
  const retryAt = result.status === 'retry' && backoff !== undefined
    ? new Date(Date.now() + Math.max(backoff * 60, result.retryAfterSeconds ?? 0) * 1000)
    : undefined
  await Inquiry.updateOne(owned, {
    $set: {
      [`${field}.status`]: retryAt ? 'pending' : result.status === 'sent' ? 'sent' : 'failed',
      [`${field}.leaseUntil`]: new Date(0),
      ...(retryAt ? { [`${field}.nextAttemptAt`]: retryAt } : {}),
      ...(result.status === 'sent' ? { [`${field}.sentAt`]: new Date() } : {}),
    },
    $unset: { [`${field}.leaseToken`]: '' },
  })

  if (result.status !== 'sent') {
    logger.warn({
      channel: channel.name, attempts, retryScheduled: Boolean(retryAt), providerCode: result.code,
    }, 'Inquiry notification attempt failed')
  }
  return true
}

function startChannelWorker(channel: NotificationChannel) {
  let stopping = false
  let running: Promise<void> | undefined

  async function drain() {
    try {
      while (!stopping && mongoose.connection.readyState === 1 && await processNotification(channel)) {
        // Process queued notifications in order until there is no eligible work.
      }
    } catch {
      logger.error({ channel: channel.name }, 'Inquiry notification queue is temporarily unavailable')
    }
  }

  function poll() {
    if (!running) running = drain().finally(() => { running = undefined })
  }

  const timer = setInterval(poll, 5000)
  poll()

  return async () => {
    stopping = true
    clearInterval(timer)
    await running
  }
}

export function startInquiryWorker() {
  const stopWorkers = channels.filter(channel => channel.enabled).map(startChannelWorker)
  return async () => {
    await Promise.all(stopWorkers.map(stop => stop()))
  }
}
