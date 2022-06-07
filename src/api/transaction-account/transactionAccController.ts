import { Request, Response, NextFunction } from 'express'
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
			res.status(200).send({ transactionAccount })
		} catch (err) {
			throw err
		}
	}

	getTransactionAccountById = async (req: GetTransactionAccountByIdRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const userId = +req.user.id

		try {
			const transactionAccount = await this.transactionAccService.fetch(id, userId)
			res.status(200).send({ transactionAccount })
		} catch (err) {
			throw err
		}
	}

	createTransactionAccount = async (req: CreateTransactionAccountRequest, res: Response, next: NextFunction) => {
		const user_id = +req.user.id
		const params = {...req.body, user_id}

		try {
			const transactionAccount = await this.transactionAccService.add(params as TransactionAccountType)
			res.status(200).send({ transactionAccount })
		} catch (err) {
			throw err
		}
	}

	updateTransaction = async (req: UpdateTransactionAccountRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const user_id = +req.user.id
		const params = {...req.body, user_id}
		try {
			const transactionAccount = await this.transactionAccService.update(id, params)
			res.status(200).send({ transactionAccount })
		} catch (err) {
			throw err
		}
	}
}
