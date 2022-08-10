import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { UserFCMTokenController } from './userFCMTokenController'

const userFCMTokenController = new UserFCMTokenController()
export const userFCMTokenRouter = express.Router()

userFCMTokenRouter.post('/add', authMiddleware, userFCMTokenController.addFcmToken as Application)
userFCMTokenRouter.put('/delete', authMiddleware, userFCMTokenController.deleteFcmToken as Application)
