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

	getAllQuestions = async (req: Request, res: Response, next: NextFunction) => {
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
			next(err)
		}
	}

	createQuestion = async (req: Request, res: Response, next: NextFunction) => {
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
			next(err)
		}
	}

	getQuestionById = async (req: GetQuestionsByUniqueId, res: Response, next: NextFunction) => {
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
			next(err)
		}
	}

	updateQuestion = async (req: UpdateQuestionRequest, res: Response, next: NextFunction) => {
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
			next(err)
		}
	}

	deleteQuestion = async (req: DeleteQuestionRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id

		try {
			const questions = await this.questionsService.fetchById(id)
			if (!questions.length) {
				throw new Error(Messages.QUESTION_NOT_FOUND)
			}

			await this.questionsService.delete(id)
			return res.status(200).send({
				code: 200,
				message: Messages.DELETE_QUESTION
			})
		} catch (err) {
			next(err)
		}
	}
}
