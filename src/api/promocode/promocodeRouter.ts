import express, { Application } from 'express'
import { PromocodeController } from './promocodeController'
import { authMiddleware } from '../helper/authMiddleware'

const promocodeController = new PromocodeController()
export const promocodeRouter = express.Router()

promocodeRouter.get('/list', authMiddleware, promocodeController.list as Application)
promocodeRouter.post('/create', authMiddleware, promocodeController.createBulkPromocodes as Application)
promocodeRouter.put('/update/:id', authMiddleware, promocodeController.updatePromocode as Application)
promocodeRouter.delete('/delete/:id', authMiddleware, promocodeController.deletePromocode as Application)
promocodeRouter.get('/utilize/:promocode', authMiddleware, promocodeController.utilize as Application)