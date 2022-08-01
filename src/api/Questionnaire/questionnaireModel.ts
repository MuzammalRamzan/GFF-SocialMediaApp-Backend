import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'

export class Questions extends Model {}
Questions.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		question: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		sequelize,
		tableName: 'questions'
	}
)

Questions.sync()
