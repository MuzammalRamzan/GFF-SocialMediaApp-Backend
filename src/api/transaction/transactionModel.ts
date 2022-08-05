import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/index'
import { TransactionAccount } from '../transaction-account/transactionAccModel'
import { TransactionCategory } from '../transaction-category/transactionCategoryModel'
import { transactionType } from './interface'

export class Transaction extends Model {}

Transaction.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		frequency: {
			type: DataTypes.ENUM('Daily', 'Weekly', 'Monthly', 'Never'),
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
			type: DataTypes.ENUM('Active', 'Inactive', 'Deleted'),
			allowNull: false
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: false
		},
		due_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		payed_at: {
			type: DataTypes.DATE,
			allowNull: false
		},
		transaction_type: {
			type: DataTypes.VIRTUAL,
			get() {
				return this.getDataValue('amount') > 0 ? transactionType.INCOME : transactionType.EXPENSE
			}
		}
	},
	{
		sequelize,
		tableName: 'transaction'
	}
)

Transaction.belongsTo(TransactionCategory, { as: 'transaction_category', foreignKey: 'category_id' })
Transaction.belongsTo(TransactionAccount, { as: 'transaction_account', foreignKey: 'account_id' })

Transaction.sync()
