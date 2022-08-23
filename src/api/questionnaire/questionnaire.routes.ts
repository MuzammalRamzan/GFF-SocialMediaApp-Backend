import express, { Application } from 'express'
import { validateReq } from '../../helper/validationMiddleware'
import { authMiddleware } from '../helper/authMiddleware'
import { QuestionnaireController } from './questionnaire.controller'
import {
	createQuestionValidator,
	questionnaireIdExistInParams,
	roleIdExistInParams,
	saveOrUpdateAnswersValidator,
	updateAnswers
} from './validator'

export const questionnaireRouter = express.Router()
const questionnaireController = new QuestionnaireController()

questionnaireRouter.post(
	'/',
	authMiddleware,
	createQuestionValidator,
	validateReq,
	questionnaireController.createQuestion as Application
)
questionnaireRouter.get(
	'/:role_id',
	roleIdExistInParams,
	validateReq,
	authMiddleware,
	questionnaireController.getQuestionnaire as Application
)
questionnaireRouter.post(
	'/answer',
	authMiddleware,
	saveOrUpdateAnswersValidator,
	validateReq,
	questionnaireController.saveAnswers as Application
)
questionnaireRouter.put(
	'/answer',
	authMiddleware,
	updateAnswers,
	saveOrUpdateAnswersValidator,
	validateReq,
	questionnaireController.updateAnswers as Application
)
questionnaireRouter.put(
	'/:id',
	authMiddleware,
	questionnaireIdExistInParams,
	validateReq,
	questionnaireController.updateQuestion as Application
)
questionnaireRouter.get('/answer', authMiddleware, questionnaireController.getAnswers as Application)
