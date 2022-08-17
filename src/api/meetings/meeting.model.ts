import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'
import { MeetingRequestStatus } from './interface'
import { MeetingParticipants } from './meetingParticipants.model'

export class Meeting extends Model {}

Meeting.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: { type: DataTypes.STRING, allowNull: false },
		roomId: { type: DataTypes.INTEGER },
		startTime: { type: DataTypes.DATE, allowNull: false },
		endTime: { type: DataTypes.DATE },
		reservationTime: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.fn('NOW') },
		canceledTime: { type: DataTypes.DATE },
		description: { type: DataTypes.STRING },
		canceledReason: { type: DataTypes.STRING },
		status: { type: DataTypes.ENUM(...Object.values(MeetingRequestStatus)) },
		createdBy: { type: DataTypes.INTEGER, allowNull: false }
	},
	{ sequelize, tableName: 'meeting' }
)

Meeting.hasMany(MeetingParticipants, { as: 'participants', foreignKey: 'meeting_id' })
MeetingParticipants.belongsTo(Meeting, { as: 'meeting', foreignKey: 'meeting_id' })

Meeting.sync()
