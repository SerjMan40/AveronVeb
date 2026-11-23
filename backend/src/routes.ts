import { Router } from 'express'
import { healthRouter } from './modules/health/index.js'
import { contactRouter } from './modules/contact/contact.routes.js'
export const apiRouter = Router()
apiRouter.use('/health', healthRouter)
apiRouter.use('/contact', contactRouter)
// Mount feature routers here, for example: apiRouter.use('/resources', resourceRouter)
