import { addCreatedAtColumn, removeContentBodyColumn } from './dailyDose'
import { changeIdDatatype } from './migration'
import {
	addRecurringStatusColumn,
	addTransactionTypeColumn,
	allowNullInDueAndPaidAtColumns,
	allowNullInTransactionAccount,
	changeStatusColumnDataType,
	renameIconColumnInCategory
} from './transaction'
import { addPromotedTillColumn, addIsSubscribedNewsletterColumn } from './user'
import { addBraintreeCustomerIdColumn, addLatitudeColumn, addLongitudeColumn } from './userInfo'

export class AlterationsManager {
	public static async run() {
		await changeIdDatatype()

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

		await removeContentBodyColumn()
		await addCreatedAtColumn()
		// user table
		await addPromotedTillColumn()
		await addIsSubscribedNewsletterColumn()
	}
}
