import {
	addRecurringStatusColumn,
	addTransactionTypeColumn,
	allowNullInDueAndPaidAtColumns,
	changeStatusColumnDataType,
	renameIconColumnInCategory
} from './transaction'
import { addBraintreeCustomerIdColumn, addLatitudeColumn, addLongitudeColumn } from './userInfo'

export class AlterationsManager {
	public static async run() {
		// Transaction table alterations
		await addRecurringStatusColumn()
		await changeStatusColumnDataType()
		await allowNullInDueAndPaidAtColumns()
		await addTransactionTypeColumn()

		await renameIconColumnInCategory()

		await addLatitudeColumn()
		await addLongitudeColumn()
		await addBraintreeCustomerIdColumn()
	}
}
