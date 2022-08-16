import { Currency } from '../currency/currencyModel'
import { ITransactionAccountService, Status, TransactionAccountType } from './interface'
import { TransactionAccount } from './transactionAccModel'

// TODO: pull data from db with user id and join it with account types table

export class TransactionAccService implements ITransactionAccountService {
	private readonly TransactionAccountAttributes = {
		attributes: ['id', 'account_type_id', 'balance', 'currency_id', 'name', 'status', 'user_id'],
		include: [{ model: Currency, as: 'currency' }]
	}

	static parseTransactionAccount(transactionAccount: TransactionAccount[]) {
		return transactionAccount.map(account => {
			const transactionAcc = account.toJSON()
			if (transactionAcc?.currency) {
				transactionAcc['currency_symbol'] = transactionAcc.currency.symbol
				transactionAcc['currency_name'] = transactionAcc.currency.name

				delete transactionAcc['currency']
			}
			return transactionAcc
		})
	}

	static async filterTransactionAccount(id: number) {
		const account = await TransactionAccount.findOne({
			where: {
				id
			},
			attributes: ['id', 'account_type_id', 'balance', 'currency_id', 'name', 'status', 'user_id'],
			include: [{ model: Currency, as: 'currency' }]
		})

		if (!account) throw new Error("Account doesn't exist")

		return TransactionAccService.parseTransactionAccount([account])[0]
	}

	async list(): Promise<TransactionAccount[]> {
		const transactionAcc = await TransactionAccount.findAll()
		return transactionAcc as TransactionAccount[]
	}

	async fetch(id: number, userId: number): Promise<TransactionAccount[]> {
		const transactionAccount = await TransactionAccount.findAll({
			where: {
				id: id,
				user_id: userId,
				status: Status.Active
			},
			...this.TransactionAccountAttributes
		})

		return TransactionAccService.parseTransactionAccount(transactionAccount) as TransactionAccount[]
	}

	async fetchForUser(userId: number): Promise<TransactionAccount[]> {
		const accounts = await TransactionAccount.findAll({
			where: {
				user_id: userId,
				status: Status.Active
			},
			...this.TransactionAccountAttributes
		})

		return TransactionAccService.parseTransactionAccount(accounts)
	}

	async add(params: TransactionAccountType): Promise<TransactionAccount | null> {
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
			status: Status.Active,
		})
		return await TransactionAccService.filterTransactionAccount(transactionAccount.get('id') as number)
	}

	async update(id: number, params: TransactionAccountType): Promise<TransactionAccount | null> {
		const updatedTransactionAccount = await TransactionAccount.update(
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
					id: id,
					user_id: params.user_id,
					status: Status.Active
				}
			}
		)
		if (updatedTransactionAccount[0] === 1) {
			return await TransactionAccService.filterTransactionAccount(id)
		}

		throw new Error('Unauthorized')
	}

	async delete(id: number, userId: number): Promise<number> {
		const account = await TransactionAccount.update(
			{
				status: Status.Deleted
			},
			{
				where: {
					id,
					user_id: userId
				}
			}
		)

		return account[0]
	}

	static async isActiveAccount(id: number, userId: number): Promise<boolean> {
		const account = await TransactionAccount.findOne({
			where: {
				id,
				user_id: userId,
				status: Status.Active
			}
		})

		return !!account
	}
}
