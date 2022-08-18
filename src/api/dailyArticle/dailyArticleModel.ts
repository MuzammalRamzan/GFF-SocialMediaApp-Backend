import { DataTypes, Model } from 'sequelize'
import { DATABASE_TABLES } from '../../constants/db_tables'
import { sequelize } from '../../database/index'
import { categoryType } from './interface'

export class DailyArticle extends Model { }

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
		keyWord: {
			type: DataTypes.STRING
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: new Date()
		},
		category: {
			type: DataTypes.JSON,
			allowNull: false
		}
	},

	{
		sequelize,
		tableName: DATABASE_TABLES.DAILY_ARTICLE
	}
)
DailyArticle.sync()
