import type { RequestHandler } from 'express'
import { AppError } from '../errors/app-error.js'
export const requireAuthenticated: RequestHandler = (request, _response, next) => {
  if (request.isAuthenticated()) { next(); return }
  next(new AppError(401, 'UNAUTHENTICATED', 'Authentication required'))
}
