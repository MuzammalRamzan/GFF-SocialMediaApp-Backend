import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { EmailController } from './emailController'

const emailController = new EmailController()
export const emailRouter = express.Router()

emailRouter.post('/send', authMiddleware, emailController.sendEmail as Application)
