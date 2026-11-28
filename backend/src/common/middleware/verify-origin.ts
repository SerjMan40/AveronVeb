import type { RequestHandler } from 'express'
import { AppError } from '../errors/app-error.js'
import { clientOrigins } from '../../config/env.js'

export const verifyRequestOrigin: RequestHandler = (request, _response, next) => {
  const origin = request.get('origin')
  if (origin && !['GET', 'HEAD', 'OPTIONS'].includes(request.method) && !clientOrigins.includes(origin)) {
    next(new AppError(403, 'ORIGIN_NOT_ALLOWED', 'Request origin is not allowed'))
    return
  }
  next()
}
