import express, { Application } from 'express';
import { UserInformationController } from './userInformationController';

const userInformationController = new UserInformationController()
export const userInformationRouter = express.Router();

userInformationRouter.get('/:user_id', userInformationController.getUserInformationByUserId as Application)
userInformationRouter.post('/add', userInformationController.createUserInformation as Application)
userInformationRouter.put('/update/:id', userInformationController.updateUserInformation as Application)
userInformationRouter.delete('/delete/:id', userInformationController.deleteUserInformation as Application)
