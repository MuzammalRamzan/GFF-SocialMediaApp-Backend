import { Request, Response, NextFunction } from 'express'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import {
	TransactionAccountType,
	GetTransactionAccountByIdRequest,
	CreateTransactionAccountRequest,
	UpdateTransactionAccountRequest
} from './interface'
import { TransactionAccService } from './transactionAccService'

export class TransactionAccController {
	private readonly transactionAccService: TransactionAccService

	constructor() {
		this.transactionAccService = new TransactionAccService()
	}

	getAllTransactionAccounts = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const transactionAccount = await this.transactionAccService.list()
			return res.status(200).send({
				data: {
					transactionAccount
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

	getTransactionAccountById = async (req: GetTransactionAccountByIdRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const userId = +req.user.id

		try {
			const transactionAccount = await this.transactionAccService.fetch(id, userId)
			return res.status(200).send({
				data: {
					transactionAccount
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

	createTransactionAccount = async (req: CreateTransactionAccountRequest, res: Response, next: NextFunction) => {
		const user_id = +req.user.id
		const params = { ...req.body, user_id }

		try {
			const transactionAccount = await this.transactionAccService.add(params as TransactionAccountType)
			return res.status(200).send({
				data: {
					transactionAccount
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

	updateTransaction = async (req: UpdateTransactionAccountRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const user_id = +req.user.id
		const params = { ...req.body, user_id }
		try {
			const transactionAccount = await this.transactionAccService.update(id, params)
			return res.status(200).send({
				data: {
					transactionAccount
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
