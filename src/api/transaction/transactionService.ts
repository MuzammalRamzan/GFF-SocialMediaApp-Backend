import { Includeable } from 'sequelize/types'
import { TransactionAccount } from '../transaction-account/transactionAccModel'
import { TransactionCategory } from '../transaction-category/transactionCategoryModel'
import moment from 'moment'
import sequelize, { Op } from 'sequelize'
import { GffError } from '../helper/errorHandler'
import { Frequency, ITransactionService, ListTransactionsReqParams, Status, TransactionType } from './interface'
import { Transaction } from './transactionModel'

export class TransactionService implements ITransactionService {
	private readonly include: Includeable | Includeable[] = [
		{ model: TransactionCategory, as: 'transaction_category' },
		{
			model: TransactionAccount,
			as: 'transaction_account',
			attributes: ['id', 'balance', 'account_type_id', 'name', 'country', 'currency_id', 'user_id', 'status']
		}
	]

	async list(params: ListTransactionsReqParams, userId: number): Promise<Transaction[]> {

		const filter: any = {
			user_id: userId,
		}

		if (params.status) {
			filter.status = params.status
		}
		if (params.frequency) {
			filter.frequency = params.frequency
		}

		const transactions = await Transaction.findAll({
			include: this.include,
			where: filter
		})
		return transactions
	}

	async fetchForUser(userId: number): Promise<Transaction[]> {
		const transactions = await Transaction.findAll({
			where: {
				user_id: userId
			}
		})

		return transactions
	}

	async add(params: TransactionType): Promise<Transaction> {
		const created_at = new Date().getTime()
		const transaction = await Transaction.create({
			frequency: params.frequency,
			user_id: params.user_id,
			account_id: params.account_id,
			amount: params.amount,
			category_id: params.category_id,
			status: params.status,
			created_at: created_at,
			due_date: params.due_date,
			paid_at: params.paid_at,
			recurring_status: params.frequency !== Frequency.Never ? Status.Active : Status.Inactive,
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
			const transaction = await Transaction.findByPk(id)
			return transaction as Transaction
		}

		throw new Error('Unauthorized')
	}

	async delete(id: number, user_id: number): Promise<number> {
		const transaction = await Transaction.update({
			status: Status.Deleted
		}, {
			where: {
				id: id,
				user_id: user_id
			}
		})
		return transaction[0]
	}

	async markAsPaid(id: number, user_id: number): Promise<Transaction> {
		const transaction = await Transaction.findOne({ where: { id } })

		if (transaction?.getDataValue('user_id') !== user_id) {
			throw new GffError('Unauthorized', { errorCode: '403' })
		}

		if (transaction.getDataValue('status') === Status.Paid) {
			throw new GffError('Transaction has already been marked as paid!', { errorCode: '400' })
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
						paid_at: { [Op.eq]: null },
					},
					{ due_date: { [Op.lte]: moment().utc().endOf('month') } }
				]
			}
		})
		return transactions
	}

	async getPaidTransactions(user_id: number): Promise<Transaction[]> {
		const transactions = await Transaction.findAll({
			where: {
				user_id,
				status: Status.Paid,
				paid_at: { [Op.ne]: null }
			}
		})
		return transactions
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
