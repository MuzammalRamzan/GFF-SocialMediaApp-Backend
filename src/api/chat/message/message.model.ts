import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../../database'
import { User } from '../../user/userModel'
import { Room } from '../room/room.model'

export class Message extends Model { }

Message.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		body: {
			type: DataTypes.STRING,
			allowNull: false
		},
		read: { type: DataTypes.BOOLEAN, defaultValue: 0 },
		room_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('NOW')
		}
	},
	{
		sequelize,
		tableName: 'message'
	}
)

Message.belongsTo(User, {
	foreignKey: 'user_id',
	as: 'user'
})

Message.belongsTo(Room, { foreignKey: 'room_id', as: 'room' })

Message.sync()
