import express from 'express';
import { AuthController } from './authController';

const authController = new AuthController()
export const authRouter = express.Router();

authRouter.get('/signup', authController.signUp)
authRouter.get('/login', authController.signIn)
