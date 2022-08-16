import {
	addRecurringStatusColumn,
	addTransactionTypeColumn,
	allowNullInDueAndPaidAtColumns,
	allowNullInTransactionAccount,
	changeStatusColumnDataType,
	renameIconColumnInCategory
} from './transaction'
import { addPromotedTillColumn } from './user'
import { addBraintreeCustomerIdColumn, addLatitudeColumn, addLongitudeColumn } from './userInfo'

export class AlterationsManager {
	public static async run() {
		// Transaction table alterations
		await addRecurringStatusColumn()
		await changeStatusColumnDataType()
		await allowNullInDueAndPaidAtColumns()
		await addTransactionTypeColumn()
		await allowNullInTransactionAccount()

		await renameIconColumnInCategory()

		await addLatitudeColumn()
		await addLongitudeColumn()
		await addBraintreeCustomerIdColumn()

		// user table 
		await addPromotedTillColumn()
	}
}
