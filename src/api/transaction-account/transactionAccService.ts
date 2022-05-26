import { ITransactionAccountService, TransactionAccountType } from './interface'
import { TransactionAccount } from './transactionAccModel'

export class TransactionAccService implements ITransactionAccountService {
	async list(): Promise<TransactionAccount[]> {
		const transactionAcc = await TransactionAccount.findAll()
		return transactionAcc as TransactionAccount[]
	}

	async fetch(id: number): Promise<TransactionAccount[]> {
		const transactionAccount = await TransactionAccount.findAll({
			where: {
				id: id
			}
		})

		return transactionAccount
	}

	async add(params: TransactionAccountType): Promise<TransactionAccount> {
		const transactionAccount = await TransactionAccount.create({
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
		return transactionAccount
	}

	async update(id: number, params: TransactionAccountType): Promise<[affectedCount: number]> {
		const transactionAccount = await TransactionAccount.update(
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
		return transactionAccount
	}
}
