import { Request, Response, NextFunction } from 'express'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { CreateTransactionRequest, UpdateTransactionRequest, DeleteTransactionRequest } from './interface'
import { TransactionService } from './transactionService'

export class TransactionController {
	private readonly transactionService: TransactionService

	constructor() {
		this.transactionService = new TransactionService()
	}

	getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const transaction = await this.transactionService.list()
			return res.status(200).send({
				data: {
					transaction
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			error.httpStatusCode = 401
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	createTransaction = async (req: CreateTransactionRequest, res: Response, next: NextFunction) => {
		const user_id = +req.user.id
		console.log(user_id)
		const params = { ...req.body, user_id }

		try {
			const transaction = await this.transactionService.add(params)
			return res.status(200).send({
				data: {
					transaction
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			error.httpStatusCode = 401
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	updateTransaction = async (req: UpdateTransactionRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const user_id = +req.user.id
		const params = { ...req.body, user_id }

		try {
			const transaction = await this.transactionService.update(id, params)
			return res.status(200).send({
				data: {
					transaction
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			error.httpStatusCode = 401
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	deleteTransaction = async (req: DeleteTransactionRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const user_id = +req.user.id

		try {
			const transaction = await this.transactionService.delete(id, user_id)
			return res.status(200).send({
				data: {
					transaction
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			error.httpStatusCode = 401
			return jsonErrorHandler(err, req, res, () => {})
		}
	}
}
