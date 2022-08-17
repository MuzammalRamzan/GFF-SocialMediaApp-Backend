import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'
import { User } from '../user/userModel'

export class MeetingParticipants extends Model { }

MeetingParticipants.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		meeting_id: { type: DataTypes.INTEGER, allowNull: false },
		user_id: { type: DataTypes.INTEGER, allowNull: false }
	},
	{ sequelize, tableName: 'meeting_participants' }
)

MeetingParticipants.belongsTo(User, { as: 'user', foreignKey: 'user_id' })

MeetingParticipants.sync()
