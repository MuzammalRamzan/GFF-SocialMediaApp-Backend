import { Includeable } from 'sequelize/types'
import { TransactionAccount } from '../transaction-account/transactionAccModel'
import { TransactionCategory } from '../transaction-category/transactionCategoryModel'
import moment from 'moment'
import sequelize, { Op } from 'sequelize'
import { GffError } from '../helper/errorHandler'
import {
	Frequency,
	ITransactionService,
	ListTransactionsReqParams,
	Status,
	transactionType,
	TransactionType
} from './interface'
import { Transaction } from './transactionModel'
import { Currency } from '../currency/currencyModel'
import { ObjectParser } from '../../helper/ObjectParser'
import axios from 'axios'

export class TransactionService implements ITransactionService {
	static readonly transactionAccountIncludeables: Includeable | Includeable[] = [{ model: Currency, as: 'currency' }]

	static readonly transactionIncludeables: Includeable | Includeable[] = [
		{ model: TransactionCategory, as: 'transaction_category' },
		{
			model: TransactionAccount,
			as: 'transaction_account',
			attributes: ['id', 'balance', 'account_type_id', 'name', 'country', 'currency_id', 'user_id', 'status'],
			include: [{ model: Currency, as: 'currency' }]
		}
	]

	static readonly transactionIncludeablesForConvertCurrency: Includeable | Includeable[] = [
		{ model: TransactionCategory, as: 'transaction_category' },
		{
			model: TransactionAccount,
			as: 'transaction_account',
			attributes: ['id', 'account_type_id', 'name', 'country', 'currency_id', 'user_id', 'status'],
			include: [{ model: Currency, as: 'currency' }]
		}
	]

	static TransactionParser(transaction: Transaction) {
		const newData = {}
		ObjectParser(transaction.toJSON(), newData)
		return newData as Transaction
	}

	async list(params: ListTransactionsReqParams, userId: number): Promise<Transaction[]> {
		const filter: any = {
			user_id: userId
		}

		if (params.status) {
			filter.status = params.status
		}
		if (params.frequency) {
			filter.frequency = params.frequency
		}

		const transactions = await Transaction.findAll({
			include: TransactionService.transactionIncludeables,
			where: filter
		})
		return transactions.map(transaction => TransactionService.TransactionParser(transaction))
	}

	async fetchForUser(userId: number): Promise<Transaction[]> {
		const transactions = await Transaction.findAll({
			where: {
				user_id: userId
			}
		})

		return transactions.map(transaction => TransactionService.TransactionParser(transaction))
	}

	async get(userId: string, loginUser: any): Promise<Transaction[]> {
		console.log(loginUser)
		const transactions = await Transaction.findAll({
			include: TransactionService.transactionIncludeablesForConvertCurrency,
			where: {
				user_id: +userId
			}
		})

		let newData = transactions.map(transaction => TransactionService.TransactionParser(transaction))

		let response: any = []

		const currency = await Currency.findByPk(loginUser?.default_currency_id)
		const defaultCurrency = currency?.getDataValue('symbol')

		await Promise.all(
			newData.map(async (data: any): Promise<any> => {
				let obj: any = {}
				const config = {
					method: 'get',
					url: `https://api.exchangerate.host/convert?from=${data?.currency_symbol}&to=${defaultCurrency}&date=${moment(
						data?.paid_at
					)
						.subtract(1, 'day')
						.format('YYYY-MM-DD')}&amount=${data?.amount}`,
					headers: {}
				}
				const res = await axios(config)

				obj = {
					...data,
					conversionCurrency: defaultCurrency,
					convertedAmount: res.data.result.toFixed(2)
				}

				response.push(obj)
			})
		)

		return response?.sort((a: any, b: any) => b.id - a.id)
	}

	async add(params: TransactionType): Promise<Transaction> {
		const created_at = new Date().getTime()
		let transaction = await Transaction.create({
			frequency: params.frequency,
			user_id: params.user_id,
			account_id: params.account_id,
			amount: params.amount,
			category_id: params.category_id,
			status: params.status,
			created_at: created_at,
			due_date: params.due_date,
			paid_at: params.paid_at || null,
			recurring_status: params.frequency !== Frequency.Never ? Status.Active : Status.Inactive
		})
		transaction = (await Transaction.findByPk(transaction.getDataValue('id'), {
			include: TransactionService.transactionIncludeables
		})) as Transaction

		if (!transaction) throw new GffError('Transaction not found!', { errorCode: '404' })

		return TransactionService.TransactionParser(transaction)
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
				paid_at: params.paid_at,
				amount: params.amount
			},
			{
				where: {
					id: id,
					user_id: params.user_id
				}
			}
		)
		if (updatedTransaction[0] === 1) {
			const transaction = await Transaction.findByPk(id, {
				include: TransactionService.transactionIncludeables
			})

			if (!transaction) throw new GffError('Transaction not found!', { errorCode: '404' })

			return TransactionService.TransactionParser(transaction)
		}

		throw new Error('Unauthorized')
	}

	async delete(id: number, user_id: number): Promise<number> {
		const transaction = await Transaction.update(
			{
				status: Status.Deleted
			},
			{
				where: {
					id: id,
					user_id: user_id
				}
			}
		)
		return transaction[0]
	}

	async markAsPaid(id: number, user_id: number): Promise<Transaction> {
		const transaction = await Transaction.findOne({ where: { id } })

		if (transaction?.getDataValue('user_id') !== user_id) {
			throw new GffError('Unauthorized', { errorCode: '403' })
		}

		if (transaction.getDataValue('status') === Status.Paid) {
			throw new GffError('Transaction has already been marked as paid!', {
				errorCode: '400'
			})
		}

		transaction.setDataValue('status', Status.Paid)
		transaction.setDataValue('paid_at', new Date())

		await transaction.save()

		return transaction.toJSON()
	}

	async getOverDueTransactions(user_id: number): Promise<Transaction[]> {
		const transactions = await Transaction.findAll({
			where: {
				[Op.and]: [
					{
						user_id,
						paid_at: { [Op.eq]: null }
					},
					{ due_date: { [Op.lte]: moment().utc().endOf('month') } }
				]
			},
			include: TransactionService.transactionIncludeables
		})
		return transactions.map(transaction => TransactionService.TransactionParser(transaction))
	}

	async getPaidTransactions(user_id: number): Promise<Transaction[]> {
		const transactions = await Transaction.findAll({
			where: {
				user_id,
				status: Status.Paid,
				paid_at: { [Op.ne]: null }
			},
			include: TransactionService.transactionIncludeables
		})
		return transactions.map(transaction => TransactionService.TransactionParser(transaction))
	}

	async cancelRecurringTransaction(user_id: number, id: number): Promise<Transaction> {
		const transaction = await Transaction.findOne({ where: { id } })

		if (!transaction) {
			throw new GffError('Transaction not found', { errorCode: '404' })
		}

		transaction.setDataValue('recurring_status', Status.Inactive)
		await transaction.save()

		return transaction.toJSON()
	}
}
