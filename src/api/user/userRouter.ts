import express from 'express';
import { UserController } from './userController';

const userController = new UserController()
export const userRouter = express.Router();

userRouter.get('/', userController.getAllUsers)

userRouter.get(':id', userController.getUsersById)

userRouter.get('/email', userController.getUsersByEmail)
