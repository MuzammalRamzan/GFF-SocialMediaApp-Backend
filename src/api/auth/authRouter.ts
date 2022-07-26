import express from 'express'
import { AuthController } from './authController'
import validate from 'express-joi-validate'
import { signUpSchema } from '../helper/validationJoi'
import { authMiddleware } from '../helper/authMiddleware'

const authController = new AuthController()
export const authRouter = express.Router()

authRouter.post('/signup', validate(signUpSchema), authController.signUp)
authRouter.post('/login', authController.logIn)
authRouter.post('/admin/login', authController.adminLogIn)
authRouter.put('/reset-password', authMiddleware, authController.resetPassword)
