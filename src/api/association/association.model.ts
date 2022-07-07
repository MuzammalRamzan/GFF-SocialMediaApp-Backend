import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/index'
import { FindFriendModel } from '../find-friend/findFriendModel'
import { User } from '../user/userModel'

export class Associations extends Model {}

Associations.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		user_id: {
			type: DataTypes.INTEGER
		},
		find_friend_id: {
			type: DataTypes.INTEGER
		}
	},
	{
		sequelize,
		tableName: 'search_associations'
	}
)

User.hasOne(Associations, { foreignKey: 'user_id', as: 'userAssociations' })
Associations.belongsTo(FindFriendModel, { foreignKey: 'find_friend_id', as: 'findFriendAssociations' })

Associations.sync()
