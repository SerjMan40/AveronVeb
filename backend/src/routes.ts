import { Router } from 'express'
import { healthRouter } from './modules/health/index.js'
import { createInquiryRouter } from './modules/inquiries/inquiry.routes.js'

export function createApiRouter() {
  const apiRouter = Router()
  const inquiryRouter = createInquiryRouter()
  apiRouter.use('/health', healthRouter)
  apiRouter.use('/inquiries', inquiryRouter)
  apiRouter.use('/contact', inquiryRouter)
  return apiRouter
}
