import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/index'
import { Currency } from '../currency/currencyModel'
import { Status } from './interface'

export class TransactionAccount extends Model { }

TransactionAccount.init(
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
			allowNull: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		country: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: 'US'
		},
		bank_name: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: ''
		},
		card_owner: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: ''
		},
		card_number: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		card_expiration_date: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.fn('NOW')
		},
		card_cvc: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: ''
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
			type: DataTypes.ENUM(Status.Active, Status.Inactive, Status.Deleted),
			allowNull: false
		}
	},
	{
		sequelize,
		tableName: 'transaction_account'
	}
)

TransactionAccount.belongsTo(Currency, { as: 'currency', foreignKey: 'currency_id' })

TransactionAccount.sync()
