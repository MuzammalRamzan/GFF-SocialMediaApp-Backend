import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'
import { paymentTransaction } from '../payment-api/paymentTransactionModel'
import { User } from '../user/userModel'
import { WellnessWarrior } from '../wellness-warrior/wellnessWarriorModel'

export class WellnessWarriorsCertificate extends Model {}

WellnessWarriorsCertificate.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		wellness_warrior_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		authority: {
			type: DataTypes.STRING,
			allowNull: false
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		pdfUrl: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		sequelize: sequelize,
		tableName: 'wellness_warriors_certificates'
	}
)

// WellnessWarriorsCertificate.belongsTo(WellnessWarrior, {
// 	foreignKey: 'wellness_warrior_id',
// 	as: 'wellness_warrior'
// })

WellnessWarriorsCertificate.sync()
