import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'
import { Crew } from '../crew/crewModel'
import { User } from '../user/userModel'

export class CrewMember extends Model {}

export enum CrewMemberInvitationStatus {
	INVITED = 'invited',
	ACCEPTED = 'accepted',
	REJECTED = 'rejected'
}

export enum CrewMemberRole {
	OWNER = 'owner',
	MEMBER = 'member'
}

CrewMember.init(
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
		crew_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		status: {
			type: DataTypes.ENUM(
				CrewMemberInvitationStatus.INVITED,
				CrewMemberInvitationStatus.ACCEPTED,
				CrewMemberInvitationStatus.REJECTED
			),
			defaultValue: CrewMemberInvitationStatus.INVITED
		},
		role: {
			type: DataTypes.ENUM(CrewMemberRole.OWNER, CrewMemberRole.MEMBER),
			defaultValue: CrewMemberRole.MEMBER
		}
	},
	{
		sequelize: sequelize,
		tableName: 'crewMember'
	}
)

CrewMember.belongsTo(User, {
	foreignKey: 'user_id',
	as: 'user',
	onDelete: 'CASCADE'
})

CrewMember.sync()
