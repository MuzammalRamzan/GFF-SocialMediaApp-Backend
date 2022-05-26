import express from 'express';
import { AuthController } from './authController';

const authController = new AuthController()
export const authRouter = express.Router();

authRouter.post('/signup', authController.signUp)
authRouter.post('/login', authController.logIn)
