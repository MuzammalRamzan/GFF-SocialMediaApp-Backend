import express from 'express';
import { AuthController } from './authController';
import validate from 'express-joi-validate';
import { signUpSchema } from '../helper/validationJoi';

const authController = new AuthController()
export const authRouter = express.Router();

authRouter.post('/signup', validate(signUpSchema), authController.signUp)
authRouter.post('/login', authController.logIn)


