import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'
import { UserInformationType } from '../user-information/interface'

export interface IWarriorInformation {
	id: number
	user_id: number
	specialty: string[]
	certification: string[]
	therapy_type: string[]
	price_range: string[]
	user?: UserInformationType
}

export class WarriorInformation extends Model {}

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
			allowNull: true,
			get() {
				let arr: string[] = (this.getDataValue('specialty') || '').split(',')
				return arr.filter(str => !!str)
			}
		},
		certification: {
			type: DataTypes.STRING,
			allowNull: true,
			get() {
				let arr: string[] = (this.getDataValue('certification') || '').split(',')
				return arr.filter(str => !!str)
			}
		},
		therapy_type: {
			type: DataTypes.STRING,
			allowNull: true,
			get() {
				let arr: string[] = (this.getDataValue('therapy_type') || '').split(',')
				return arr.filter(str => !!str)
			}
		},
		price_range: {
			type: DataTypes.STRING,
			allowNull: true,
			get() {
				let arr: string[] = (this.getDataValue('price_range') || '').split(',')
				return arr.filter(str => !!str)
			}
		}
	},
	{
		sequelize: sequelize,
		tableName: 'warrior_information'
	}
)

WarriorInformation.sync()
