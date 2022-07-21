import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../../database'
import { Message } from '../message/message.model'

export class Room extends Model {}

Room.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		user_ids: {
			// separated by comma
			type: DataTypes.STRING,
			allowNull: false,
			get() {
				let arr: string[] = (this.getDataValue('user_ids') || '').split(',')
				arr = arr.filter(str => !!str)
				return arr.map(userId => +userId)
			}
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: new Date()
		}
	},
	{
		sequelize,
		tableName: 'room'
	}
)

Room.sync()
