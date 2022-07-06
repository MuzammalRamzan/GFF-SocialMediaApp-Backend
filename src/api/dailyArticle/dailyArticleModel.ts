import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/index'
import { categoryType } from './interface'

export class DailyArticle extends Model {}

DailyArticle.init(
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
			type: DataTypes.STRING
		},
		category: {
			type: DataTypes.JSON,
			allowNull: false
		}
	},

	{
		sequelize,
		tableName: 'dailyArticle'
	}
)
DailyArticle.sync()
