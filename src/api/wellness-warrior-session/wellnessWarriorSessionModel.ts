import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'
import { paymentTransaction } from '../payment-api/paymentTransactionModel'
import { User } from '../user/userModel'
import { WellnessWarrior } from '../wellness-warrior/wellnessWarriorModel'

export class WellnessWarriorSession extends Model {}

WellnessWarriorSession.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		wellness_warrior_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		start_time: {
			type: DataTypes.STRING,
			allowNull: false
		},
		end_time: {
			type: DataTypes.STRING,
			allowNull: false
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		transaction_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	},
	{
		sequelize: sequelize,
		tableName: 'wellness_warrior_session'
	}
)

WellnessWarriorSession.belongsTo(User, {
	foreignKey: 'user_id',
	as: 'user'
})

WellnessWarriorSession.belongsTo(WellnessWarrior, {
	foreignKey: 'wellness_warrior_id',
	as: 'wellness_warrior'
})

WellnessWarriorSession.belongsTo(paymentTransaction, {
	foreignKey: 'transaction_id',
	as: 'transaction'
})

WellnessWarriorSession.sync()
