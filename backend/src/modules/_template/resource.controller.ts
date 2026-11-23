import type { RequestHandler } from 'express'
import { resourceService } from './resource.service.js'
const list: RequestHandler = async (_request, response, next) => {
  try { response.json(await resourceService.list()) } catch (error) { next(error) }
}
export const resourceController = { list }
