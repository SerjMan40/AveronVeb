import type { RequestHandler } from 'express'
import { clientOrigins } from '../../config/env.js'
export const verifyRequestOrigin: RequestHandler = (request, response, next) => {
  const origin = request.get('origin')
  if (!origin || ['GET', 'HEAD', 'OPTIONS'].includes(request.method) || clientOrigins.includes(origin)) { next(); return }
  response.status(403).json({ error: { code: 'ORIGIN_NOT_ALLOWED', message: 'Request origin is not allowed' } })
}
