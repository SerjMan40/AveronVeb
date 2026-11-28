import 'dotenv/config'
import { z } from 'zod'

const optional = (schema: z.ZodType<string>) =>
  z.preprocess(value => typeof value === 'string' && !value.trim() ? undefined : value, schema.optional())

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  MONGODB_URI: optional(z.string().regex(/^mongodb(?:\+srv)?:\/\//)),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173').transform(value =>
    value.split(',').map(origin => origin.trim()).filter(Boolean),
  ).refine(origins => origins.length > 0 && origins.every(origin => {
    try {
      const url = new URL(origin)
      return ['http:', 'https:'].includes(url.protocol) && url.origin === origin
    } catch {
      return false
    }
  })),
  TRUST_PROXY_HOPS: z.coerce.number().int().nonnegative().default(0),
  INQUIRY_RETENTION_DAYS: z.coerce.number().int().min(1).max(365).default(90),
  TELEGRAM_BOT_TOKEN: optional(z.string().regex(/^\d+:[A-Za-z0-9_-]+$/)),
  TELEGRAM_CHAT_ID: optional(z.string().regex(/^-?[1-9]\d*$/).refine(value => Number.isSafeInteger(Number(value)))),
  RESEND_API_KEY: optional(z.string().min(1)),
  INQUIRY_MAIL_FROM: optional(z.email()),
  INQUIRY_MAIL_TO: optional(z.email()),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
}).superRefine((values, context) => {
  const mailKeys = ['RESEND_API_KEY', 'INQUIRY_MAIL_FROM', 'INQUIRY_MAIL_TO'] as const
  if (mailKeys.some(key => values[key])) {
    for (const key of mailKeys) {
      if (!values[key]) context.addIssue({ code: 'custom', path: [key], message: 'Required' })
    }
  }
  if (Boolean(values.TELEGRAM_BOT_TOKEN) !== Boolean(values.TELEGRAM_CHAT_ID)) {
    const missing = values.TELEGRAM_BOT_TOKEN ? 'TELEGRAM_CHAT_ID' : 'TELEGRAM_BOT_TOKEN'
    context.addIssue({ code: 'custom', path: [missing], message: 'Required when Telegram is configured' })
  }
  if (values.NODE_ENV === 'production') {
    if (!values.MONGODB_URI) {
      context.addIssue({ code: 'custom', path: ['MONGODB_URI'], message: 'Required' })
    }
    if (!values.CLIENT_ORIGIN.every(origin => origin.startsWith('https://'))) {
      context.addIssue({ code: 'custom', path: ['CLIENT_ORIGIN'], message: 'HTTPS required' })
    }
  }
})

const parsed = schema.safeParse(process.env)
if (!parsed.success) {
  console.error('Invalid environment variables:', [...new Set(parsed.error.issues.map(issue => issue.path.join('.')))].join(', '))
  process.exit(1)
}

export const env = parsed.data
export const clientOrigins = env.CLIENT_ORIGIN
