import 'dotenv/config'
import { z } from 'zod'
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1).optional(),
  CLIENT_ORIGIN: z.string().min(1).default('http://localhost:5173'),
  SESSION_SECRET: z.string().min(32).default('development-only-session-secret-change-me'),
  SESSION_COOKIE_NAME: z.string().min(1).default('project_session'),
  SESSION_COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  SESSION_COOKIE_SECURE: z.stringbool().optional(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  CONTACT_WEBHOOK_URL: z.preprocess((value) => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().url().optional()),
  CONTACT_WEBHOOK_TOKEN: z.string().optional(),
}).superRefine((values, context) => {
  if (values.NODE_ENV === 'production' && !values.MONGODB_URI) {
    context.addIssue({ code: 'custom', path: ['MONGODB_URI'], message: 'MONGODB_URI is required in production' })
  }
})
const parsed = schema.safeParse(process.env)
if (!parsed.success) { console.error('Invalid environment variables', z.flattenError(parsed.error).fieldErrors); process.exit(1) }
export const env = parsed.data
export const clientOrigins = env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
