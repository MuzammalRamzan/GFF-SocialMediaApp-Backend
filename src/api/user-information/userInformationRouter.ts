import express, { Application } from 'express';
import { authMiddleware } from '../helper/authMiddleware';
import { UserInformationController } from './userInformationController';

const userInformationController = new UserInformationController()
export const userInformationRouter = express.Router();

userInformationRouter.get('/:user_id', authMiddleware, userInformationController.getUserInformationByUserId as Application)
userInformationRouter.post('/add', authMiddleware, userInformationController.createUserInformation as Application)
userInformationRouter.put('/update', authMiddleware, userInformationController.updateUserInformation as Application)
userInformationRouter.delete('/delete/:user_id', authMiddleware, userInformationController.deleteUserInformation as Application)
