import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'

export interface IPromocode {
	id: number
	promo_code: string
	issue_date: Date
	expiration_date: Date
	duration: number
	status: 'USED' | 'NOT_USED' | 'EXPIRED'
}

export class Promocode extends Model {
}

Promocode.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		promo_code: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		issue_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		expiration_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		duration: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		status: {
			type: DataTypes.ENUM('USED', 'NOT_USED', 'EXPIRED'),
			allowNull: false
		}
	},
	{
		sequelize,
		tableName: 'promocodes',
		timestamps: true
	}
)

Promocode.sync()
