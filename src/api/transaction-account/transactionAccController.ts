import { Request, Response, NextFunction } from 'express'
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
			if (!transactionAccount.length) {
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
			next(err);
		}
	}

	getAllTransactionAccountsForUser = async (
		req: GetTransactionAccountByIdRequest,
		res: Response,
		next: NextFunction
	) => {
		const userId = +req.user.id
		// const result: AccountArray = {
		// 	bank: [],
		// 	card: [],
		// 	manual: [],
		// 	mPesa: [],
		// 	wallet: [],
		// }

		try {
			const accountDetails = await this.transactionAccService.fetchForUser(userId)

			// TODO: match results by id

			// accountResult.forEach((element, index) => {
			// 	switch (element.getDataValue('account_type_id')) {
			// 		case 1:
			// 			result.bank.push(element)
			// 			break
			// 		case 2:
			// 			result.card.push(element)
			// 			break
			// 		case 3:
			// 			result.manual.push(element)
			// 			break
			// 		case 4:
			// 			result.mPesa.push(element)
			// 			break
			// 		case 5:
			// 			result.wallet.push(element)
			// 			break
			// 	}
			// })

			return res.status(200).send({
				data: {
					accountDetails
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
			if (!transactionAccount.length) {
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
			next(err)
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
			next(err);
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
			next(err);
		}
	}

	deleteTransactionAccount = async (req: GetTransactionAccountByIdRequest, res: Response, next: NextFunction) => {
		const userId = +req.user.id
		const id = +req.params.id
		try {
			const transactionAcc = await this.transactionAccService.delete(id, userId)
			return res.status(200).send({
				data: {
					transactionAcc
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			next(err)
		}
	}
}
