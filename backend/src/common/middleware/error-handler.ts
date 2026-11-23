import type { ErrorRequestHandler, RequestHandler } from 'express'
import { ZodError, treeifyError } from 'zod'
import { logger } from '../../config/logger.js'
import { AppError } from '../errors/app-error.js'
export const notFoundHandler: RequestHandler = (request, _response, next) => next(new AppError(404, 'ROUTE_NOT_FOUND', `Route ${request.method} ${request.originalUrl} not found`))
export const errorHandler: ErrorRequestHandler = (error: unknown, request, response, _next) => {
  if (error instanceof ZodError) { response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Request validation failed', fields: treeifyError(error) } }); return }
  if (error instanceof AppError) { response.status(error.statusCode).json({ error: { code: error.code, message: error.message } }); return }
  logger.error({ error, method: request.method, url: request.originalUrl }, 'Unhandled request error')
  response.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
}
