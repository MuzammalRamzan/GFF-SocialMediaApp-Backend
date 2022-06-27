import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/index'

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
    keyword: {
      type: DataTypes.STRING
    },
    category: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['news', 'music', 'wise-words']
    },
  },
  
	{
		sequelize,
		tableName: 'dailyDose'
	}
)
DailyDose.sync();