import { validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { CreateUserInformationRequest, GetUserInformationByUserIdRequest } from '../user-information/interface'
import { PaymentService } from './paymentService'

export class QuestionnaireController {
	private readonly paymentService: PaymentService

	constructor() {
		this.paymentService = new PaymentService()
	}

	createTransaction = async (req: CreateUserInformationRequest, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req).array({ onlyFirstError: true })
			if (errors.length) {
				console.log(errors)
				return res.status(400).json({ errors: errors, message: 'Validation error', code: 400 })
			}

			const requestObj = {
				token: req.body.token,
				amount: req.body.amount,
				userId: req.user.id,
				deviceData: req.body.deviceData,
				serviceProviderId: req.body.serviceProviderId,
				date: req.body.date,
				startTime: req.body.startTime,
				endTime: req.body.endTime
			}

			const transactionStatus = await this.paymentService.create(requestObj)

			return res.status(200).send({
				data: {
					transactionStatus
				},
				code: 200
			})
		} catch (err) {
			next(err)
		}
	}

	getTransaction = async (req: GetUserInformationByUserIdRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req.user.id
			const transaction = await this.paymentService.list(userId)

			return res.status(200).send({
				code: 200,
				message: 'Fetch transactions successfully',
				data: {
					transaction
				}
			})
		} catch (err) {
			next(err)
		}
	}
}
