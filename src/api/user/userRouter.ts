import express from 'express';
import { UserController } from './userController';

const userController = new UserController()
export const userRouter = express.Router();

userRouter.get('/', userController.getAllUsers)
userRouter.get('/:id', userController.getUsersById)
userRouter.get('/email/:email', userController.getUsersByEmail)
userRouter.put('/update/:id', userController.updateUser)
userRouter.delete('/delete/:id', userController.deleteUser)
