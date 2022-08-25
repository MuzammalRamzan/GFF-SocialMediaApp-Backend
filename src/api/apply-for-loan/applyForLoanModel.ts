import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'

import { User } from '../user/userModel'

export class ApplyForLoan extends Model {}

ApplyForLoan.init(
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
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		years: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	},
	{
		sequelize: sequelize,
		tableName: 'apply_for_loan'
	}
)

ApplyForLoan.belongsTo(User, {
	foreignKey: 'user_id',
	as: 'user'
})

ApplyForLoan.sync()
