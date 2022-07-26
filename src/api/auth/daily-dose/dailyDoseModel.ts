import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/index'
import { categoryType } from './interface'
export class DailyDose extends Model {}

DailyDose.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		subtitle: {
			type: DataTypes.STRING,
			allowNull: false
		},
		image: {
			type: DataTypes.STRING,
			allowNull: false
		},
		contentURL: {
			type: DataTypes.STRING
		},
		contentBody: {
			type: DataTypes.STRING
		},
		keyWord: {
			type: DataTypes.JSON
		},
		category: {
			type: DataTypes.ENUM(categoryType.MUSIC, categoryType.NEWS, categoryType.WISEWORD),
			allowNull: false
		}
	},

	{
		sequelize,
		tableName: 'dailyDose'
	}
)
DailyDose.sync()
