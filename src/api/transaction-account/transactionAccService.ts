import { ITransactionAccount, TransactionAccType } from './interface'
import { TransactionAcc } from './transactionAccModel'

export class TransactionAccService implements ITransactionAccount {
	async list(): Promise<TransactionAcc[]> {
		const transactionAcc = await TransactionAcc.findAll()
		return transactionAcc as TransactionAcc[]
	}

	async fetch(id: number): Promise<TransactionAcc[]> {
		const transactionAcc = await TransactionAcc.findAll({
			where: {
				id: id
			}
		})

		return transactionAcc as TransactionAcc[]
	}

	async add(params: TransactionAccType): Promise<TransactionAcc> {
		const transactionAcc = await TransactionAcc.create({
			balance: params.balance,
			account_type_id: params.account_type_id,
			name: params.name,
			country: params.country,
			bank_name: params.bank_name,
			card_owner: params.card_owner,
			card_number: params.card_number,
			card_expiration_date: params.card_expiration_date,
			card_cvc: params.card_cvc,
			currency_id: params.currency_id,
			user_id: params.user_id,
			status: params.status
		})
		return transactionAcc as TransactionAcc
	}

	async update(id: number, params: TransactionAccType): Promise<number> {
		const transactionAcc = await TransactionAcc.update(
			{
				balance: params.balance,
				account_type_id: params.account_type_id,
				name: params.name,
				country: params.country,
				bank_name: params.bank_name,
				card_owner: params.card_owner,
				card_number: params.card_number,
				card_expiration_date: params.card_expiration_date,
				card_cvc: params.card_cvc,
				currency_id: params.currency_id,
				user_id: params.user_id,
				status: params.status
			},
			{
				where: {
					id: id
				}
			}
		)
		return transactionAcc as unknown as number
	}
}
