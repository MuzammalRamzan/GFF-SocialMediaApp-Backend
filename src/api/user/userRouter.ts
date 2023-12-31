import express, { Application } from 'express'
import { adminMiddleware } from '../helper/AdminMiddleware'
import { authMiddleware } from '../helper/authMiddleware'
import { UserController } from './userController'

const userController = new UserController()
export const userRouter = express.Router()

userRouter.get('/', userController.getAllUsers)
userRouter.get('/my-info', authMiddleware, userController.getMyInfo as Application)
userRouter.get('/fullUser', authMiddleware, userController.getFullUserByUserId as Application)
userRouter.get('/:id', authMiddleware, userController.getUserDetailsById as Application)
userRouter.get('/email/:email', authMiddleware, userController.getUsersByEmail as Application)
userRouter.put('/update', authMiddleware, userController.updateUser as Application)
userRouter.delete('/delete/:id', authMiddleware, userController.deleteUser as Application)
userRouter.put('/deactivate/:id', authMiddleware, adminMiddleware, userController.deactivateUserAccount as Application)
