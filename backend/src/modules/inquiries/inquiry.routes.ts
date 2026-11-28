import { json, Router } from 'express'
import rateLimit from 'express-rate-limit'
import { AppError } from '../../common/errors/app-error.js'
import { validate } from '../../common/middleware/validate.js'
import { createInquiry } from './inquiry.controller.js'
import { inquirySchema } from './inquiry.schema.js'

export function createInquiryRouter() {
  const router = Router()
  const inquiryRateLimit = rateLimit({
    windowMs: 15 * 60_000,
    limit: 6,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_request, _response, next) => {
      next(new AppError(429, 'RATE_LIMITED', 'Please wait before sending another inquiry'))
    },
  })

  router.post('/', inquiryRateLimit, (request, _response, next) => {
    if (!request.is('application/json')) {
      next(new AppError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Expected an application/json request'))
      return
    }
    next()
  }, json({ limit: '24kb', inflate: false }), validate(inquirySchema), createInquiry)
  return router
}
