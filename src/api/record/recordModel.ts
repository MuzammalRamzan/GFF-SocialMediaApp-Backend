import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/index'

export class Record extends Model {}

Record.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		type: {
			type: DataTypes.ENUM('expense', 'income'),
			allowNull: false
		},
		category_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		timestamp: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		},
		transaction_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		currency_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		account_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	},
	{
		sequelize,
		tableName: 'transaction_history'
	}
)
