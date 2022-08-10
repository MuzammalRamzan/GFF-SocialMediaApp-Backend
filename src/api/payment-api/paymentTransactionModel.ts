import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/index'
import { User } from '../user/userModel'
import { PaymentStatus } from './interface'

export class paymentTransaction extends Model {
	[x: string]: any
}

paymentTransaction.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		status: {
			type: DataTypes.ENUM(PaymentStatus.PENDING, PaymentStatus.FAILED, PaymentStatus.SUCCESS, PaymentStatus.REFUND),
			allowNull: false
		},
		buyer_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		service_provider_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		session_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		transaction_id: {
			type: DataTypes.STRING,
			allowNull: false
		},
		transaction_data: {
			type: DataTypes.STRING,
			allowNull: false
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: false
		}
	},
	{
		sequelize,
		tableName: 'payment_transaction'
	}
)

paymentTransaction.belongsTo(User, { foreignKey: 'buyer_id', as: 'buyer' })
paymentTransaction.belongsTo(User, { foreignKey: 'service_provider_id', as: 'service_provider' })

paymentTransaction.sync()
