import { env } from '../../config/env.js'
import { sendTelegramMessage, type TelegramDeliveryResult } from '../../integrations/telegram/index.js'
import type { InquiryDocument } from './inquiry.model.js'

export const telegramConfigured = Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID)

const singleLine = (value: string) => value.replace(/[\r\n\u2028\u2029]+/g, ' ')

export async function sendInquiryTelegram(inquiry: InquiryDocument): Promise<TelegramDeliveryResult> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return { status: 'failed', code: 400 }

  const text = [
    'Averon Web | New project inquiry',
    `ID: ${inquiry.id}`,
    `Received (UTC): ${inquiry.createdAt.toISOString()}`,
    `Name: ${singleLine(inquiry.name)}`,
    `Email: ${inquiry.email}`,
    `Company: ${singleLine(inquiry.company) || '—'}`,
    `Project: ${inquiry.service}`,
    `Language: ${inquiry.locale}`,
    '',
    'Project brief:',
    inquiry.message,
  ].join('\n')

  return sendTelegramMessage(env.TELEGRAM_BOT_TOKEN, {
    chatId: Number(env.TELEGRAM_CHAT_ID),
    text,
    protectContent: true,
  })
}
