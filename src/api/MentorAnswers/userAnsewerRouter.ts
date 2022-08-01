import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { QuestionnaireController } from './questionAnswersController'

const questionController = new QuestionnaireController()
export const UserAnswersRouter = express.Router()

UserAnswersRouter.post('/answer_questionnaire', authMiddleware, questionController.giveAnswers as Application)
