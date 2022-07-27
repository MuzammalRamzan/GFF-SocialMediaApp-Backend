import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { QuestionnaireController } from './questionnaireController'

const questionController = new QuestionnaireController()
export const mentorInfoRouter = express.Router()

mentorInfoRouter.get(
	'/questions/personality_questionnaire',
	authMiddleware,
	questionController.getAllQuestions as Application
)
mentorInfoRouter.post('/question/add_question', authMiddleware, questionController.createQuestion as Application)
mentorInfoRouter.get('/question/:id', authMiddleware, questionController.getQuestionById as Application)
mentorInfoRouter.put('/question/update_question/:id', authMiddleware, questionController.updateQuestion as Application)
mentorInfoRouter.delete(
	'/question/delete_question/:id',
	authMiddleware,
	questionController.deleteQuestion as Application
)
