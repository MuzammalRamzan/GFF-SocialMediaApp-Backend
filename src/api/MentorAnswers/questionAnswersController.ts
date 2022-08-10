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

	giveAnswers = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req?.user?.id || (0 as number)

			const userAnswersArray = req.body.list
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
				return res.status(400).send({
					message: errorMessage,
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
			next(err)
		}
	}
}
