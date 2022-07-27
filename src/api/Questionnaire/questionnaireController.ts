import { Messages } from './interface'
import { Request, Response, NextFunction } from 'express'
import { INTEGER } from 'sequelize/types'
import { IAuthenticatedRequest } from '../helper/authMiddleware'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { DeleteQuestionRequest, GetQuestionsByUniqueId, UpdateQuestionRequest } from './interface'
import { QuestionService } from './questionnaireService'

export class QuestionnaireController {
	private readonly questionsService: QuestionService

	constructor() {
		this.questionsService = new QuestionService()
	}

	getAllQuestions = async (req: Request, res: Response) => {
		try {
			const questions = await this.questionsService.list()
			return res.status(200).send({
				data: {
					questions
				},
				code: 200,
				message: Messages.GET_ALL_QUESTION
			})
		} catch (err) {
			console.log(err)
			const error = err as GffError
			if (error.message === Messages.UNAUTHORIZED) {
				error.errorCode = '401'
				error.httpStatusCode = 401
			} else if (error.message === Messages.NOT_FOUND) {
				error.errorCode = '404'
				error.httpStatusCode = 404
			} else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	createQuestion = async (req: Request, res: Response) => {
		const Question_name = req.body.question
		try {
			const Question = await this.questionsService.add(Question_name)
			return res.status(200).send({
				data: {
					Question
				},
				code: 200,
				message: Messages.CREATE_QUESTION
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === Messages.UNAUTHORIZED) {
				error.errorCode = '401'
				error.httpStatusCode = 401
			} else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	getQuestionById = async (req: GetQuestionsByUniqueId, res: Response) => {
		const id = +req.params.id

		try {
			const questions = await this.questionsService.fetchById(id)
			if (!questions.length) {
				throw new Error(Messages.QUESTION_NOT_FOUND)
			}

			const question = questions[0]
			return res.status(200).send({
				data: {
					question
				},
				code: 200,
				message: Messages.GET_QUESTION
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === Messages.UNAUTHORIZED) {
				error.errorCode = '401'
				error.httpStatusCode = 401
			} else if (error.message === Messages.NOT_FOUND) {
				error.errorCode = '404'
				error.httpStatusCode = 404
			} else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	updateQuestion = async (req: UpdateQuestionRequest, res: Response) => {
		const id = +req.params.id
		const params = req.body

		try {
			const questions = await this.questionsService.fetchById(id)
			if (!questions.length) {
				throw new Error(Messages.QUESTION_NOT_FOUND)
			}

			const question = await this.questionsService.update(id, params)
			return res.status(200).send({
				data: {
					question
				},
				code: 200,
				message: Messages.UPDATE_QUESTION
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === Messages.UNAUTHORIZED) {
				error.errorCode = '401'
				error.httpStatusCode = 401
			} else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	deleteQuestion = async (req: DeleteQuestionRequest, res: Response) => {
		const id = +req.params.id

		try {
			const questions = await this.questionsService.fetchById(id)
			if (!questions.length) {
				throw new Error(Messages.QUESTION_NOT_FOUND)
			}

			const question = await this.questionsService.delete(id)
			return res.status(200).send({
				code: 200,
				message: Messages.DELETE_QUESTION
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === Messages.UNAUTHORIZED) {
				error.errorCode = '401'
				error.httpStatusCode = 401
			} else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}
}
