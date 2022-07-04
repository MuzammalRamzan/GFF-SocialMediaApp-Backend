import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/index'

export class Feedback extends Model {}

Feedback.init(
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
		name: { type: DataTypes.STRING, allowNull: false },
		email: { type: DataTypes.STRING, allowNull: false },
		comment: { type: DataTypes.STRING, allowNull: false }
	},
	{
		sequelize,
		tableName: 'feedback'
	}
)

Feedback.sync();