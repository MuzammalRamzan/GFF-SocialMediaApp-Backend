import express, { Application } from 'express';
import { authMiddleware } from '../helper/authMiddleware';
import { UserController } from './userController';

const userController = new UserController()
export const userRouter = express.Router();

userRouter.get('/', userController.getAllUsers)
userRouter.get('/:id', authMiddleware, userController.getUsersById as Application)
userRouter.get('/email/:email', authMiddleware,userController.getUsersByEmail as Application)
userRouter.put('/update/:id', authMiddleware, userController.updateUser as Application)
userRouter.delete('/delete/:id', authMiddleware, userController.deleteUser as Application)
userRouter.get('/friend/search', authMiddleware, userController.searchFriend)
