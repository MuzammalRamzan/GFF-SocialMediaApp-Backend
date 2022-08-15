import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'
import { Room } from '../chat/room/room.model'
import { CrewMember } from '../crewMember/crewMemberModel'
import { User } from '../user/userModel'

export class Crew extends Model {}

Crew.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		created_by_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		is_archived: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		room_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	},
	{
		sequelize: sequelize,
		tableName: 'crew'
	}
)

Crew.belongsTo(User, {
	foreignKey: 'created_by_id',
	as: 'created_by'
})

Crew.belongsTo(Room, {
	foreignKey: 'room_id',
	as: 'room'
})

Crew.hasMany(CrewMember, {
	foreignKey: 'crew_id',
	sourceKey: 'id',
	as: 'crew_members',
	onDelete: 'CASCADE'
})

Crew.sync()
