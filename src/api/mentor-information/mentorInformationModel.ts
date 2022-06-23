import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../../database'
import { User } from '../user/userModel'

export interface IMentorInformation {
	id: number
	user_id: number
	isPassedIRT: boolean
	industry: string[]
	role: string[]
	frequency: string[]
	conversation_mode: string[]
	languages: string[]
}

export class MentorInformation extends Model {}

MentorInformation.init(
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
		isPassedIRT: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		industry: {
			type: DataTypes.STRING,
			defaultValue: ''
		},
		role: {
			type: DataTypes.STRING,
			defaultValue: ''
		},
		frequency: {
			type: DataTypes.STRING,
			defaultValue: ''
		},
		languages: {
			type: DataTypes.STRING,
			defaultValue: ''
		},
		conversation_mode: {
			type: DataTypes.STRING,
			defaultValue: ''
		}
	},
	{
		sequelize: sequelize,
		tableName: 'mentor_information',
		hooks: {
			afterFind(instancesOrInstance: any) {
				if (instancesOrInstance) {
					if (Array.isArray(instancesOrInstance)) {
						instancesOrInstance.forEach(instance => {
							instance.industry = instance.industry.split(',')
							instance.role = instance.role.split(',')
							instance.frequency = instance.frequency.split(',')
							instance.languages = instance.languages.split(',')
							instance.conversation_mode = instance.conversation_mode.split(',')
						})
					} else {
						instancesOrInstance.industry = instancesOrInstance.industry.split(',')
						instancesOrInstance.role = instancesOrInstance.role.split(',')
						instancesOrInstance.frequency = instancesOrInstance.frequency.split(',')
						instancesOrInstance.languages = instancesOrInstance.languages.split(',')
						instancesOrInstance.conversation_mode = instancesOrInstance.conversation_mode.split(',')
					}
				}
			}
		}
	}
)

MentorInformation.sync()
