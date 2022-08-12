import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'
import { User } from '../user/userModel'

export class UserFCMTokens extends Model {}
UserFCMTokens.init(
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
		token: {
			type: DataTypes.STRING,
			allowNull: false
		},
	},
	{
		sequelize,
		tableName: 'user_fcm_tokens',
		timestamps: true,
		createdAt: true,
		updatedAt: true
	}
)

UserFCMTokens.belongsTo(User, { foreignKey: 'user_id', as: 'user' })
User.hasOne(UserFCMTokens, {
	foreignKey: 'user_id',
	as: 'user_fcm_token'
})

UserFCMTokens.sync()
// const queryInterface = sequelize.getQueryInterface();;
//
// queryInterface.addConstraint('user_fcm_tokens', {
// 	fields: ['user_id', 'token'],
// 	type: 'unique',
// 	name: 'unique_user_id_token_key'
// });

