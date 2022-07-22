import { DataTypes, Model } from 'sequelize'
import { HookReturn } from 'sequelize/types/hooks'
import { sequelize } from '../../../database'
import { Message } from '../message/message.model'

export class Room extends Model { }

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
				const arr: string[] = (this.getDataValue('user_ids') || '').split(',')
				return arr.filter(str => !!str).map(userId => +userId)
			},
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
		tableName: 'room',
		hooks: {
			beforeCreate(attributes: Room, options): HookReturn {
				const ids = attributes.get('user_ids') as number[];
				ids.sort((a, b) => a - b)
				attributes.set('user_ids', ids.join(','))
			},
		}
	}
)

Room.sync()
