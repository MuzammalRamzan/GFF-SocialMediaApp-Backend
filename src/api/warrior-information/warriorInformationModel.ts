import { DataTypes, Model } from 'sequelize'
import { DATABASE_TABLES } from '../../constants/db_tables'
import { sequelize } from '../../database'
import { UserInformationType } from '../user-information/interface'
import { Status } from './interface'

export interface IWarriorInformation {
	id: number
	user_id: number
	specialty: string[]
	certification: string[]
	therapy_type: string[]
	hourly_rate: number
	user?: UserInformationType
	conversation_mode: string[]
	status: Status
	language: string[]
}

export class WarriorInformation extends Model { }

WarriorInformation.init(
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
		specialty: {
			type: DataTypes.STRING,
			get() {
				let arr: string[] = (this.getDataValue('specialty') || '').split(',')
				return arr.filter(str => !!str)
			}
		},
		certification: {
			type: DataTypes.STRING,
			get() {
				let arr: string[] = (this.getDataValue('certification') || '').split(',')
				return arr.filter(str => !!str)
			}
		},
		therapy_type: {
			type: DataTypes.STRING,
			get() {
				let arr: string[] = (this.getDataValue('therapy_type') || '').split(',')
				return arr.filter(str => !!str)
			}
		},
		conversation_mode: {
			type: DataTypes.STRING,
			get() {
				let arr: string[] = (this.getDataValue('conversation_mode') || '').split(',')
				return arr.filter(str => !!str)
			}
		},
		hourly_rate: { type: DataTypes.INTEGER, defaultValue: 0 },
		language: {
			type: DataTypes.STRING,
			get() {
				let arr: string[] = (this.getDataValue('language') || '').split(',')
				return arr.filter(str => !!str)
			}
		},
		status: {
			type: DataTypes.ENUM(...Object.values(Status)),
			defaultValue: Status.PENDING
		}
	},
	{
		sequelize: sequelize,
		tableName: DATABASE_TABLES.WARRIOR_INFORMATION
	}
)

WarriorInformation.sync()
