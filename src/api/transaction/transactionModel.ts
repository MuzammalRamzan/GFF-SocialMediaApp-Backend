import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/index'
import { Frequency } from './interface'

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
			allowNull: false
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
			type: DataTypes.ENUM('Active', 'Inactive'),
			allowNull: true
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
		paid_at: {
			type: DataTypes.DATE,
			allowNull: true
		},
		parent_transaction_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: null,
		}
	},
	{
		sequelize,
		tableName: 'transaction'
	}
)

Transaction.hasMany(Transaction, { as: 'child_transactions', foreignKey: 'parent_transaction_id' })

Transaction.sync()
