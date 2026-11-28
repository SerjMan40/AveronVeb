import { z } from 'zod'
import type { TelegramDeliveryResult, TelegramMessage } from './telegram.types.js'

const telegramResponse = z.object({
  ok: z.boolean(),
  error_code: z.number().int().min(400).max(599).optional(),
  parameters: z.object({
    retry_after: z.number().int().positive().max(86_400).optional(),
  }).optional(),
})

export async function sendTelegramMessage(
  token: string,
  message: TelegramMessage,
): Promise<TelegramDeliveryResult> {
  const tokenSegment = encodeURIComponent(token).replace('%3A', ':')
  try {
    const response = await fetch(`https://api.telegram.org/bot${tokenSegment}/sendMessage`, {
      method: 'POST',
      redirect: 'error',
      signal: AbortSignal.timeout(8000),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: message.chatId,
        text: message.text,
        link_preview_options: { is_disabled: true },
        protect_content: message.protectContent,
      }),
    })

    const parsed = telegramResponse.safeParse(await response.json().catch(() => undefined))
    const payload = parsed.data
    if (response.ok && payload?.ok === true) return { status: 'sent' }

    const code = payload?.error_code ?? response.status
    if (code === 408 || code === 429 || code >= 500 || (response.ok && !payload?.error_code)) {
      return { status: 'retry', code, retryAfterSeconds: payload?.parameters?.retry_after }
    }
    return { status: 'failed', code }
  } catch {
    return { status: 'retry' }
  }
}
