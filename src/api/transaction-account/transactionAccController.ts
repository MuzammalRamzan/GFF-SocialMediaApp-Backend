import { Request, Response, NextFunction } from 'express'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import {
	TransactionAccountType,
	GetTransactionAccountByIdRequest,
	CreateTransactionAccountRequest,
	UpdateTransactionAccountRequest
} from './interface'
import { TransactionAccount } from './transactionAccModel'
import { TransactionAccService } from './transactionAccService'

type AccountArray = {
	bank: TransactionAccount[]
	card: TransactionAccount[]
	manual: TransactionAccount[]
	mPesa: TransactionAccount[]
	wallet: TransactionAccount[]
}

export class TransactionAccController {
	private readonly transactionAccService: TransactionAccService

	constructor() {
		this.transactionAccService = new TransactionAccService()
	}

	getAllTransactionAccounts = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const transactionAccount = await this.transactionAccService.list()
			if(!transactionAccount.length) {
				throw new Error('No data found')
			}
			return res.status(200).send({
				data: {
					transactionAccount
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			}
			else if  (error.message === 'No data found') {
				error.errorCode = '404'
				error.httpStatusCode = 404
			}
			else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	getAllTransactionAccountsForUser = async (req: GetTransactionAccountByIdRequest, res: Response, next: NextFunction) => {
		const userId = +req.user.id
		const result: AccountArray = {
			bank: [],
			card: [],
			manual: [],
			mPesa: [],
			wallet: [],
		}

		try {
			const accountResult = await this.transactionAccService.fetchForUser(userId)

			// TODO: match results by id

			accountResult.forEach((element, index) => {
				switch (element.getDataValue('account_type_id')) {
					case 1:
						result.bank.push(element)
						break
					case 2:
						result.card.push(element)
						break
					case 3:
						result.manual.push(element)
						break
					case 4:
						result.mPesa.push(element)
						break
					case 5:
						result.wallet.push(element)
						break
				}
			})

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

	getTransactionAccountById = async (req: GetTransactionAccountByIdRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const userId = +req.user.id

		try {
			const transactionAccount = await this.transactionAccService.fetch(id, userId)
			if(!transactionAccount.length) {
				throw new Error('No data found')
			}
			return res.status(200).send({
				data: {
					transactionAccount
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			}
			else if  (error.message === 'No data found') {
				error.errorCode = '404'
				error.httpStatusCode = 404
			}
			else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
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
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			}
			else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
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
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			}
			else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}
}
