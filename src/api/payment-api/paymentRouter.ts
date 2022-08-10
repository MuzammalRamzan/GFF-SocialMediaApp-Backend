import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { QuestionnaireController } from './paymentController'
import { createPaymentRequestValidation } from './validation'

const paymentController = new QuestionnaireController()
export const paymentRouter = express.Router()

paymentRouter.post(
	'/create-transaction',
	authMiddleware,
	createPaymentRequestValidation,
	paymentController.createTransaction as Application
)
paymentRouter.get('/transaction', authMiddleware, paymentController.getTransaction as Application)
