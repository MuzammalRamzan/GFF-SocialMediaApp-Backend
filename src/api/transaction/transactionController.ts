import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { IAuthenticatedRequest } from '../helper/authMiddleware'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import {
	CreateTransactionRequest,
	UpdateTransactionRequest,
	DeleteTransactionRequest,
	ListTransactionsReqParams
} from './interface'
import { TransactionService } from './transactionService'

export class TransactionController {
	private readonly transactionService: TransactionService

	constructor() {
		this.transactionService = new TransactionService()
	}

	getAllTransactions = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const queryParams = req.query as ListTransactionsReqParams
			const userId = req?.user?.id as number;

			const transaction = await this.transactionService.list(queryParams, userId)
			if (!transaction.length) {
				throw new Error('No data found')
			}
			return res.status(200).send({
				data: {
					transaction
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			next(err);
		}
	}

	getAllTransactionsForUser = async (req: DeleteTransactionRequest, res: Response, next: NextFunction) => {
		const userId = +req.user.id

		try {
			const result = await this.transactionService.fetchForUser(userId)

			return res.status(200).send({
				data: {
					result
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			next(err)
		}
	}

	createTransaction = async (req: CreateTransactionRequest, res: Response, next: NextFunction) => {
		const user_id = +req.user.id
		const params = { ...req.body, user_id }

		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				throw new Error(errors.array()[0].msg)
			}

			const transaction = await this.transactionService.add(params)
			return res.status(200).send({
				data: {
					transaction
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			next(err);
		}
	}

	updateTransaction = async (req: UpdateTransactionRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const user_id = +req.user.id
		const params = { ...req.body, user_id }

		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				throw new Error(errors.array()[0].msg)
			}

			const transaction = await this.transactionService.update(id, params)
			return res.status(200).send({
				data: {
					transaction
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			next(err);
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
			next(err);
		}
	}

	markTransactionAsPaid = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const transactionId = +req.params.id
			const userId = req.user?.id as number

			const transaction = await this.transactionService.markAsPaid(transactionId, userId)
			return res.status(200).json({ data: { transaction }, message: 'OK', code: 200 })
		} catch (error) {
			next(error)
		}
	}

	getOverDueTransactions = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const user_id = req.user?.id as number
			const transactions = await this.transactionService.getOverDueTransactions(user_id)
			return res.status(200).json({ data: { transactions }, code: 200, message: 'OK' })
		} catch (error) {
			next(error)
		}
	}

	getPaidTransactions = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const user_id = req.user?.id as number
			const transactions = await this.transactionService.getPaidTransactions(user_id)
			return res.status(200).json({ data: { transactions }, code: 200, message: 'OK' })
		} catch (error) {
			next(error)
		}
	}

	cancelRecurringTransaction = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const transactionId = +req.params.id
			const userId = req.user?.id as number

			const transaction = await this.transactionService.cancelRecurringTransaction(transactionId, userId)
			return res.status(200).json({ data: { transaction }, message: 'OK', code: 200 })
		} catch (error) {
			next(error)
		}
	}
}
