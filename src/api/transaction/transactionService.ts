import { ITransaction, TransactionType } from './interface'
import { Transaction } from './transactionModel'

export class TransactionService implements ITransaction {
	async list(): Promise<Transaction[]> {
		const records = await Transaction.findAll()
		return records as Transaction[]
	}

	async add(params: TransactionType): Promise<Transaction> {
		const record = await Transaction.create({
			frequency: params.frequency,
			user_id: params.user_id,
			account_id: params.account_id,
			category_id: params.category_id,
			status: params.status
		})
		return record as Transaction
	}

	async update(id: number, params: TransactionType): Promise<number> {
		const updatedRecord = await Transaction.update(
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
		return updatedRecord as unknown as number
	}

	async delete(id: number): Promise<number> {
		const deleteRecord = await Transaction.destroy({
			where: {
				id: id
			}
		})
		return deleteRecord as number
	}
}
