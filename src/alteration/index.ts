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
import { addPromotedTillColumn, forgotPasswordToken } from './user'
import { addBraintreeCustomerIdColumn, addLatitudeColumn, addLongitudeColumn } from './userInfo'
import { addNewColumns, addStatusColumn, removePriceRangeColumn } from './warrior_information'

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
		await forgotPasswordToken()

		// warrior_information
		await addStatusColumn()
		await removePriceRangeColumn()
		await addNewColumns()
	}
}
