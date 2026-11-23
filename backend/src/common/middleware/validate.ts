import type { RequestHandler } from 'express'
import type { ZodType } from 'zod'
export const validate = (schema: ZodType): RequestHandler => async (request, _response, next) => {
  try { request.body = await schema.parseAsync(request.body); next() } catch (error) { next(error) }
}
