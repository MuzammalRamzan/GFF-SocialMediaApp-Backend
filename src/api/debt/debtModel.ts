import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/index'

export class Debt extends Model {}

Debt.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
            allowNull: false
		},
		amount: {
			type: DataTypes.FLOAT,
		},
		due_date: {
			type: DataTypes.DATE,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	},
	{
		sequelize,
		tableName: 'debt'
	}
)
