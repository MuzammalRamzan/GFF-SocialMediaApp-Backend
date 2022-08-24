import { NextFunction, Response } from 'express'
import { IAuthenticatedRequest } from '../helper/authMiddleware'
import { GffError } from '../helper/errorHandler'
import { IQuestionnaire, IQuestionnaireAnswer } from './interface'
import { QuestionnaireService } from './questionnaire.services'

export class QuestionnaireController {
	private readonly questionnaireService: QuestionnaireService

	constructor() {
		this.questionnaireService = new QuestionnaireService()
	}

	createQuestion = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const questionDetails = req.body as IQuestionnaire
			const question = await this.questionnaireService.createQuestion(questionDetails)
			return res.status(200).json({ data: { question }, code: 200, message: 'OK' })
		} catch (err) {
			next(err)
		}
	}

	updateQuestion = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const question_id = +req.params.id

			if (!question_id) throw new GffError('Invalid question_id', { errorCode: '400' })

			const questionDetails = Object.assign(req.body, { id: question_id }) as IQuestionnaire

			const question = await this.questionnaireService.updateQuestion(questionDetails)

			return res.status(200).json({ data: { question }, code: 200, message: 'OK' })
		} catch (err) {
			next(err)
		}
	}

	getQuestionnaire = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const questionnaire = await this.questionnaireService.getQuestionnaire()
			return res.status(200).json({ data: { questionnaire }, code: 200, message: 'OK' })
		} catch (err) {
			next(err)
		}
	}

	saveAnswers = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const user_id = req.user?.id as number
			let answers = req.body.answers as IQuestionnaireAnswer[]

			answers = answers.map(answer => ({ ...answer, user_id }))

			await this.questionnaireService.saveAnswers(answers)

			return res.status(200).json({ data: {}, message: 'Answers saved!', code: 200 })
		} catch (err) {
			next(err)
		}
	}

	updateAnswers = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const user_id = req.user?.id as number
			let answers = req.body.answers as IQuestionnaireAnswer[]

			answers = answers.map(answer => ({ ...answer, user_id }))

			await this.questionnaireService.updateAnswers(answers)

			return res.status(200).json({ data: {}, message: 'Answers updated!', code: 200 })
		} catch (err) {
			next(err)
		}
	}

	getAnswers = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const meeting_id = +req.params.meeting_id;
			const answers = await this.questionnaireService.getAnswers(meeting_id)

			return res.status(200).json({ data: { answers }, message: 'OK', code: 200 })
		} catch (err) {
			next(err)
		}
	}
}
