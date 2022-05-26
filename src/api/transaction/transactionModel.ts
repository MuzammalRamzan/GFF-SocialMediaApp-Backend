import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/index'

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
		category_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		status: {
			type: DataTypes.ENUM('Active', 'Inactive', 'Deleted'),
			allowNull: false
		}
	},
	{
		sequelize,
		tableName: 'transaction'
	}
)
