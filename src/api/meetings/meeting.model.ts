import moment from 'moment'
import { DataTypes, Model } from 'sequelize'
import { DATABASE_TABLES } from '../../constants/db_tables'
import { sequelize } from '../../database'
import { MeetingRequestStatus } from './interface'
import { MeetingParticipants } from './meetingParticipants.model'

export class Meeting extends Model { }

Meeting.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: { type: DataTypes.STRING, allowNull: false },
		roomId: { type: DataTypes.INTEGER },
		startTime: {
			type: DataTypes.DATE, allowNull: false,
			get() {
				return moment(this.getDataValue('startTime')).unix()
			}
		},
		endTime: {
			type: DataTypes.DATE,
			get() {
				return moment(this.getDataValue('endTime')).unix()
			}
		},
		reservationTime: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.fn('NOW') },
		canceledTime: { type: DataTypes.DATE },
		description: { type: DataTypes.STRING },
		canceledReason: { type: DataTypes.STRING },
		status: { type: DataTypes.ENUM(...Object.values(MeetingRequestStatus)) },
		createdBy: { type: DataTypes.INTEGER, allowNull: false },
		isContractSigned: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
	},
	{ sequelize, tableName: DATABASE_TABLES.MEETING }
)

Meeting.hasMany(MeetingParticipants, { as: 'participants', foreignKey: 'meeting_id' })
MeetingParticipants.belongsTo(Meeting, { as: DATABASE_TABLES.MEETING, foreignKey: 'meeting_id' })

Meeting.sync()
