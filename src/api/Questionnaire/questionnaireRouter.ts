import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { QuestionnaireController } from './questionnaireController'

const questionController = new QuestionnaireController()
export const mentorInfoRouter = express.Router()

mentorInfoRouter.get('/personality_questionnaire', authMiddleware, questionController.getAllQuestions as Application)
mentorInfoRouter.post('/add_question', authMiddleware, questionController.createQuestion as Application)
mentorInfoRouter.get('/:id', questionController.getQuestionById as Application)
mentorInfoRouter.put('/update_question/:id', questionController.updateQuestion as Application)
mentorInfoRouter.delete('/delete_question/:id', questionController.deleteQuestion as Application)
