import { TransactionAccount } from '../transaction-account/transactionAccModel'
import { TransactionCategoryType } from '../transaction-category/interface'
import { transactionType } from '../transaction/interface'
import { Transaction } from '../transaction/transactionModel'

export type GroupedTransactionType = {
	total_amount: string
	transaction_type: transactionType
	transaction_category: TransactionCategoryType
}

export type TransactionStatistics = {
	[key in transactionType]: { total_amount: number; categories: (TransactionCategoryType & { amount: number })[] }
} & { currency_symbol: string }

export type DashboardTransactionInformation = {
	accounts: TransactionAccount[]
	paid: Transaction[]
	payment_due: Transaction[]
}

export interface IDashboardServices {
	getTransactionStatistics(user_id: number, currency_id: number): Promise<TransactionStatistics>
	getTransactionInformation(user_id: number): Promise<DashboardTransactionInformation>
}
