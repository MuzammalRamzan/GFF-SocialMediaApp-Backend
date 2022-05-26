import { ITransactionService, TransactionType } from './interface'
import { Transaction } from './transactionModel'

export class TransactionService implements ITransactionService {
	async list(): Promise<Transaction[]> {
		const transactions = await Transaction.findAll()
		return transactions
	}

	async add(params: TransactionType): Promise<Transaction> {
		const transaction = await Transaction.create({
			frequency: params.frequency,
			user_id: params.user_id,
			account_id: params.account_id,
			category_id: params.category_id,
			status: params.status
		})
		return transaction
	}

	async update(id: number, params: TransactionType): Promise<[affectedCount: number]> {
		const transaction = await Transaction.update(
			{
				frequency: params.frequency,
				user_id: params.user_id,
				account_id: params.account_id,
				category_id: params.category_id,
				status: params.status
			},
			{
				where: {
					id: id
				}
			}
		)
		return transaction
	}

	async delete(id: number): Promise<number> {
		const transaction = await Transaction.destroy({
			where: {
				id: id
			}
		})
		return transaction
	}
}
