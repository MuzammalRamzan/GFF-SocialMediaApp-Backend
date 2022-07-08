import { ITransactionService, TransactionType } from './interface'
import { Transaction } from './transactionModel'

export class TransactionService implements ITransactionService {
	async list(): Promise<Transaction[]> {
		const transactions = await Transaction.findAll()
		return transactions
	}

	async add(params: TransactionType): Promise<Transaction> {
		const created_at = new Date().getTime()
		const transaction = await Transaction.create({
			frequency: params.frequency,
			user_id: params.user_id,
			account_id: params.account_id,
			ammount: params.amount,
			category_id: params.category_id,
			status: params.status,
			created_at: created_at,
			due_date: params.due_date,
			payed_at: params.payed_at
		})
		return transaction
	}

	async update(id: number, params: TransactionType): Promise<Transaction> {
		const updatedTransaction = await Transaction.update(
			{
				frequency: params.frequency,
				user_id: params.user_id,
				account_id: params.account_id,
				category_id: params.category_id,
				status: params.status,
				due_date: params.due_date,
				payed_at: params.payed_at,
				amount: params.amount,
			},
			{
				where: {
					id: id,
					user_id: params.user_id
				}
			}
		)
		if (updatedTransaction[0] === 1) {
			const transaction = await Transaction.findByPk(id)
			return transaction as Transaction
		}

		throw new Error('Unauthorized')
	}

	async delete(id: number, user_id: number): Promise<number> {
		const transaction = await Transaction.destroy({
			where: {
				id: id,
				user_id: user_id
			}
		})
		return transaction
	}
}
