import { DataTypes, Model } from 'sequelize'
import { DATABASE_TABLES } from '../../constants/db_tables'
import { sequelize } from '../../database/index'
import { TransactionAccount } from '../transaction-account/transactionAccModel'
import { TransactionCategory } from '../transaction-category/transactionCategoryModel'
import { RecurringStatus, transactionType, Frequency } from './interface'

export class Transaction extends Model { }

Transaction.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		frequency: {
			type: DataTypes.ENUM(Frequency.Daily, Frequency.Weekly, Frequency.Monthly, Frequency.Never),
			allowNull: false
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		account_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: { notIn: [[0]] }
		},
		category_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		status: {
			type: DataTypes.ENUM('Active', 'Inactive', 'Deleted', 'Paid'),
			allowNull: true
		},
		recurring_status: {
			type: DataTypes.ENUM(RecurringStatus.Active, RecurringStatus.Inactive),
			allowNull: true
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('now'),
			allowNull: false
		},
		due_date: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.fn('now')
		},
		paid_at: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.fn('now')
		},
		transaction_type: {
			type: DataTypes.ENUM(transactionType.INCOME, transactionType.EXPENSE),
			get() {
				return this.getDataValue('amount') > 0 ? transactionType.INCOME : transactionType.EXPENSE
			}
		}
	},
	{
		sequelize,
		tableName: DATABASE_TABLES.TRANSACTION
	}
)

const beforeCreateHook = (transaction: Transaction) => {
	transaction.setDataValue(
		'transaction_type',
		transaction.getDataValue('amount') > 0 ? transactionType.EXPENSE : transactionType.INCOME
	)
}

Transaction.beforeCreate(beforeCreateHook)
Transaction.beforeUpdate(beforeCreateHook)

Transaction.belongsTo(TransactionCategory, { as: 'transaction_category', foreignKey: 'category_id' })
Transaction.belongsTo(TransactionAccount, { as: 'transaction_account', foreignKey: 'account_id' })

Transaction.sync()
