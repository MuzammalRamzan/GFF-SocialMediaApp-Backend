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

		try {
			const transactionAccount = await this.transactionAccService.fetch(id)
			res.status(200).send({ transactionAccount })
		} catch (err) {
			throw err
		}
	}

	createTransactionAccount = async (req: CreateTransactionAccountRequest, res: Response, next: NextFunction) => {
		const params = req.body

		try {
			const transactionAccount = await this.transactionAccService.add(params as unknown as TransactionAccountType)
			res.status(200).send({ transactionAccount })
		} catch (err) {
			throw err
		}
	}

	updateTransaction = async (req: UpdateTransactionAccountRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const params = req.body
		try {
			const transactionAccount = await this.transactionAccService.update(id, params)
			res.status(200).send({ transactionAccount })
		} catch (err) {
			throw err
		}
	}
}
