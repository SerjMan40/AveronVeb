import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { AppError } from '../../common/errors/app-error.js'
import { asyncHandler } from '../../common/middleware/async-handler.js'
import { validate } from '../../common/middleware/validate.js'
import { env } from '../../config/env.js'
import { contactSchema, type ContactSubmission } from './contact.schema.js'

export const contactRouter = Router()
const contactRateLimit = rateLimit({
  windowMs: 15 * 60_000,
  limit: 6,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: { code: 'TOO_MANY_CONTACT_REQUESTS', message: 'Please wait before sending another inquiry' } },
})
const serviceNames = {
  uk: ['Розробка сайтів', 'Вебдизайн', 'Технічний супровід', 'SEO та оптимізація', 'Розвиток сайту'],
  en: ['Website development', 'Web design', 'Website maintenance', 'SEO & optimization', 'Website improvement'],
  ru: ['Разработка сайтов', 'Веб-дизайн', 'Техническое сопровождение', 'SEO и оптимизация', 'Развитие сайта'],
} as const

contactRouter.post('/', contactRateLimit, validate(contactSchema), asyncHandler(async (request, response) => {
  const submission = request.body as ContactSubmission

  // Honeypot submissions receive the same response as a real accepted request.
  if (submission.website) {
    response.status(202).json({ ok: true })
    return
  }

  if (!env.CONTACT_WEBHOOK_URL) {
    throw new AppError(503, 'CONTACT_NOT_CONFIGURED', 'The contact form is not configured yet')
  }
  if (env.NODE_ENV === 'production' && new URL(env.CONTACT_WEBHOOK_URL).protocol !== 'https:') {
    throw new AppError(503, 'CONTACT_NOT_CONFIGURED', 'Contact delivery requires an HTTPS endpoint in production')
  }

  let delivery: Response
  try {
    delivery = await fetch(env.CONTACT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(env.CONTACT_WEBHOOK_TOKEN ? { authorization: `Bearer ${env.CONTACT_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        source: 'AVERON WEB website',
        receivedAt: new Date().toISOString(),
        inquiry: {
          name: submission.name,
          email: submission.email,
          company: submission.company,
          message: submission.message,
          service: serviceNames[submission.locale][Number(submission.service.slice(-1)) - 1],
          locale: submission.locale,
        },
      }),
      redirect: 'error',
      signal: AbortSignal.timeout(8000),
    })
  } catch {
    throw new AppError(502, 'CONTACT_DELIVERY_FAILED', 'Unable to deliver the inquiry')
  }

  if (!delivery.ok) throw new AppError(502, 'CONTACT_DELIVERY_FAILED', 'Unable to deliver the inquiry')
  response.status(202).json({ ok: true })
}))
