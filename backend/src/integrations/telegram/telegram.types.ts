export interface TelegramMessage {
  chatId: number | string
  text: string
  protectContent?: boolean
}

export type TelegramDeliveryResult =
  | { status: 'sent' }
  | { status: 'retry'; code?: number; retryAfterSeconds?: number }
  | { status: 'failed'; code: number }
