import { Router } from 'express'
import { resourceController } from './resource.controller.js'
export const resourceRouter = Router()
resourceRouter.get('/', resourceController.list)
