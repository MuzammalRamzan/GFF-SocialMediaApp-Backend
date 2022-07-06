import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { FeedbackService } from './feedbackService'

const handleError = (err: any, req: Request, res: Response) => {
	const error = err as GffError
	if (error.message === 'Unauthorized') {
		error.errorCode = '401'
		error.httpStatusCode = 401
	} else if (error.message === 'No data found') {
		error.errorCode = '404'
		error.httpStatusCode = 404
	} else if (error?.errorCode) {
		error.httpStatusCode = +error.errorCode
	} else {
		error.errorCode = '500'
		error.httpStatusCode = 500
	}
	return jsonErrorHandler(err, req, res, () => {})
}

export class FeedbackController {
	private readonly feedbackService: FeedbackService

	constructor() {
		this.feedbackService = new FeedbackService()
	}

	addFeedback = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req).array({ onlyFirstError: true })
			if (errors.length) {
				return res.status(400).json({ errors: errors, message: 'Validation error', code: 400 })
			}

			const feedback = await this.feedbackService.add({
				name: req.body.name,
				email: req.body.email,
				comment: req.body.comment
			})

			return res.status(200).send({
				code: 200,
				message: 'OK',
				data: { feedback }
			})
		} catch (error) {
			console.log(error);
			return handleError(error, req, res)
		}
	}
}
