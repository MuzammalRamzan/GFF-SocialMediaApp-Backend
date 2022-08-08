import { Op } from 'sequelize'
import { sequelize } from '../../database'
import { Currency } from '../currency/currencyModel'
import { TransactionAccount } from '../transaction-account/transactionAccModel'
import { TransactionCategory } from '../transaction-category/transactionCategoryModel'
import { transactionType } from '../transaction/interface'
import { Transaction } from '../transaction/transactionModel'
import {
	DashboardTransactionInformation,
	GroupedTransactionType,
	IDashboardServices,
	TransactionStatistics
} from './interface'

export class DashboardServices implements IDashboardServices {
	async getTransactionStatistics(user_id: number, currency_id: number): Promise<TransactionStatistics> {
		const currency = await Currency.findByPk(currency_id)

		const transactions = await Transaction.findAll({
			include: [
				{
					model: TransactionCategory,
					as: 'transaction_category',
					where: { [Op.or]: [{ user_id }, { is_default: true }] },
					required: true
				},
				{
					model: TransactionAccount,
					as: 'transaction_account',
					where: { currency_id },
					attributes: ['currency_id'],
					required: true
				}
			],
			attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'total_amount'], 'transaction_type'],
			group: ['transaction_type', 'category_id']
		})

		const details: TransactionStatistics = {
			currency_symbol: currency?.getDataValue('symbol'),
			[transactionType.EXPENSE]: { total_amount: 0, categories: [] },
			[transactionType.INCOME]: { total_amount: 0, categories: [] }
		}

		transactions.map(item => {
			const transaction = item.toJSON() as GroupedTransactionType

			if (transaction.transaction_type) {
				details[transaction.transaction_type].total_amount += +transaction.total_amount
				details[transaction.transaction_type].categories.push(transaction.transaction_category)
			}
		})

		return details
	}

	async getTransactionInformation(user_id: number): Promise<DashboardTransactionInformation> {
		const accounts = await TransactionAccount.findAll({ where: { user_id } })

		const payment_due = await Transaction.findAll({
			where: { user_id, due_date: { [Op.lte]: sequelize.fn('NOW') }, payed_at: null },
			include: [{ model: TransactionCategory, as: 'transaction_category' }]
		})

		const paid = await Transaction.findAll({
			where: { user_id, payed_at: { [Op.ne]: null } },
			include: [{ model: TransactionCategory, as: 'transaction_category' }],
			limit: 15
		})

		return {
			accounts: accounts.map(res => res.toJSON()),
			payment_due: payment_due.map(res => res.toJSON()),
			paid: paid.map(res => res.toJSON())
		}
	}
}
