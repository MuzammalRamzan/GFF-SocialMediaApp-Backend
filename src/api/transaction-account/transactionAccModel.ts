import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/index'

export class TransactionAcc extends Model {}

TransactionAcc.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		balance: {
			type: DataTypes.DOUBLE,
			allowNull: false
		},
		account_type_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		country: {
			type: DataTypes.STRING,
			allowNull: false
		},
		bank_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		card_owner: {
			type: DataTypes.STRING,
			allowNull: false
		},
		card_number: {
			type: DataTypes.STRING,
			allowNull: false
		},
		card_expiration_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		card_cvc: {
			type: DataTypes.STRING,
			allowNull: false
		},
		currency_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		user_id: {
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
		tableName: 'transaction_account'
	}
)
