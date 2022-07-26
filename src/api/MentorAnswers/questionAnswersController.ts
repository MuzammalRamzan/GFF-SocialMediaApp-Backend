import { Messages } from './interface'
import { Request, Response, NextFunction } from 'express'
import { IAuthenticatedRequest } from '../helper/authMiddleware'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { IAnswers } from './interface'
import { QuestionService } from './userAnswerService'

export class QuestionnaireController {
	private readonly questionsService: QuestionService

	constructor() {
		this.questionsService = new QuestionService()
	}

	giveAnswers = async (req: IAuthenticatedRequest, res: Response) => {
		try {
			const userId = req?.user?.id || (0 as number)

			const userAnswersArray = req.body
			const questions = await this.questionsService.list()

			let answersArray: IAnswers[] = []
			let errorMessage = undefined

			questions.map(question => {
				let queId = question.getDataValue('id')

				const answer = userAnswersArray.find((answer: IAnswers) => +answer.question_id === queId)

				if (!answer) {
					errorMessage = Messages.GIVE_ALL_ANSWER
				} else {
					answersArray.push({
						question_id: +answer.question_id,
						answer: answer.answer.toString(),
						user_id: userId
					})
				}
			})

			if (errorMessage) {
				return res.status(200).send({
					data: {
						errorMessage
					},
					code: 400
				})
			}

			await this.questionsService.deleteAll(userId)
			await this.questionsService.createAll(answersArray)

			return res.status(200).send({
				data: {
					answersArray
				},
				code: 200,
				message: Messages.SUBMIT_ANSWER
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
}
