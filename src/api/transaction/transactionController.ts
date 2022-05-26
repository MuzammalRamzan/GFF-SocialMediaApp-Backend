import { Request, Response, NextFunction } from 'express'
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
			res.send(transaction)
		} catch (err) {
			throw err
		}
	}

	createTransaction = async (req: CreateTransactionRequest, res: Response, next: NextFunction) => {
		const params = req.body

		try {
			const transaction = await this.transactionService.add(params)
			res.send(transaction)
		} catch (err) {
			throw err
		}
	}

	updateTransaction = async (req: UpdateTransactionRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const params = req.body

		try {
			const transaction = await this.transactionService.update(id, params)
			res.status(200).send({ transaction })
		} catch (err) {
			throw err
		}
	}

	deleteTransaction = async (req: DeleteTransactionRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id

		try {
			const transaction = await this.transactionService.delete(id)
			res.status(200).send({ transaction })
		} catch (err) {
			throw err
		}
	}
}
