import moment from 'moment'
import { Op } from 'sequelize'
import { sequelize } from '../../database'
import { Currency } from '../currency/currencyModel'
import { TransactionAccount } from '../transaction-account/transactionAccModel'
import { TransactionAccService } from '../transaction-account/transactionAccService'
import { transactionType } from '../transaction/interface'
import { Transaction } from '../transaction/transactionModel'
import { TransactionService } from '../transaction/transactionService'
import {
	DashboardTransactionInformation,
	GetChartReqQueryType,
	GroupedTransactionType,
	IDashboardServices,
	TransactionStatistics
} from './interface'

export class DashboardServices implements IDashboardServices {
	async getTransactionStatistics(
		user_id: number,
		currency_id: number,
		params?: GetChartReqQueryType
	): Promise<TransactionStatistics> {
		const currency = await Currency.findByPk(currency_id)

		const transactions = await Transaction.findAll({
			where: {
				[Op.and]: [
					{ user_id },
					...(params?.start
						? [
								{
									created_at: { [Op.gte]: moment.unix(params.start).utc() }
								}
						  ]
						: []),
					...(params?.end
						? [
								{
									created_at: { [Op.lte]: moment.unix(params.end).utc() }
								}
						  ]
						: [])
				]
			},
			include: TransactionService.transactionIncludeables,
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
				details[transaction.transaction_type].categories.push({
					...transaction.transaction_category,
					amount: +transaction.total_amount
				})
			}
		})

		return details
	}

	async getTransactionInformation(user_id: number): Promise<DashboardTransactionInformation> {
		const accounts = await TransactionAccount.findAll({
			where: { user_id },
			attributes: ['id', 'balance', 'account_type_id', 'name', 'country', 'currency_id', 'user_id', 'status'],
			include: TransactionService.transactionAccountIncludeables
		})

		const payment_due = await Transaction.findAll({
			where: { user_id, due_date: { [Op.lte]: sequelize.fn('NOW') }, paid_at: null },
			include: TransactionService.transactionIncludeables
		})

		const paid = await Transaction.findAll({
			where: { user_id, paid_at: { [Op.ne]: null } },
			include: TransactionService.transactionIncludeables,
			limit: 15
		})

		return {
			accounts: TransactionAccService.parseTransactionAccount(accounts),
			payment_due: payment_due.map(transaction => TransactionService.TransactionParser(transaction)),
			paid: paid.map(transaction => TransactionService.TransactionParser(transaction))
		}
	}
}
