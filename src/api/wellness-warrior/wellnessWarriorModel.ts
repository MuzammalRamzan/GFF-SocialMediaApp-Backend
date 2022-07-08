import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'
import { User } from '../user/userModel'
import { RequestType, StatusType } from './interface'

export class WellnessWarrior extends Model {}

WellnessWarrior.init(
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
		warrior_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		status: {
			type: DataTypes.ENUM(StatusType.APPROVE, StatusType.REJECT, StatusType.SEND),
			defaultValue: StatusType.SEND
		},
		request_type: {
			type: DataTypes.ENUM(RequestType.FAVORITE, RequestType.WARRIOR),
			defaultValue: RequestType.WARRIOR
		}
	},
	{
		sequelize: sequelize,
		tableName: 'wellness_warrior'
	}
)

WellnessWarrior.belongsTo(User, {
	foreignKey: 'user_id',
	as: 'user'
})

WellnessWarrior.belongsTo(User, {
	foreignKey: 'warrior_id',
	as: 'warrior'
})

WellnessWarrior.sync()
