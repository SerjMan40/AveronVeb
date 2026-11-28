import type { ErrorRequestHandler, RequestHandler } from 'express'
import { ZodError } from 'zod'
import { logger } from '../../config/logger.js'
import { AppError } from '../errors/app-error.js'

export const notFoundHandler: RequestHandler = (_request, _response, next) => {
  next(new AppError(404, 'ROUTE_NOT_FOUND', 'Route not found'))
}

const bodyErrors = new Map([
  ['entity.too.large', new AppError(413, 'REQUEST_TOO_LARGE', 'Request body is too large')],
  ['entity.parse.failed', new AppError(400, 'INVALID_JSON', 'Invalid JSON request body')],
  ['encoding.unsupported', new AppError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Request encoding is unsupported')],
  ['charset.unsupported', new AppError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Request charset is unsupported')],
  ['request.aborted', new AppError(400, 'REQUEST_ABORTED', 'Request was interrupted')],
  ['request.size.invalid', new AppError(400, 'INVALID_REQUEST_SIZE', 'Request size is invalid')],
])

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, next) => {
  if (response.headersSent) {
    next(error)
    return
  }
  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        fields: error.issues.filter(issue => issue.path.length).map(issue => ({
          field: issue.path[0],
          code: issue.code,
        })),
      },
    })
    return
  }
  const parserError = error instanceof Error && 'type' in error && typeof error.type === 'string'
    ? bodyErrors.get(error.type)
    : undefined
  const known = error instanceof AppError ? error : parserError
  if (known) {
    response.status(known.statusCode).json({ error: { code: known.code, message: known.message } })
    return
  }
  logger.error('Unhandled request error')
  response.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } })
}
