import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/index'

export class Currency extends Model {}

Currency.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
            allowNull: false
		},
		symbol: {
			type: DataTypes.STRING,
		},
		name: {
			type: DataTypes.STRING,
		},
	},
	{
		sequelize,
		tableName: 'currency'
	}
)
