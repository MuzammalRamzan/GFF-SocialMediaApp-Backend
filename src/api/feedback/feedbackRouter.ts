import express, { Application } from 'express'
import { FeedbackController } from './feedbackController'
import { addFeedbackValidation } from './validation'

const feedbackController = new FeedbackController()
export const feedbackRouter = express.Router()

feedbackRouter.post('/', addFeedbackValidation, feedbackController.addFeedback as Application)
