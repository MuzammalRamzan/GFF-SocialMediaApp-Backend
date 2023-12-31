import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/index'
import { FindFriendModel } from '../find-friend/findFriendModel'
import { MentorMatcherModel } from '../mentor-matcher/mentorMatcherModel'
import { User } from '../user/userModel'
import { WellnessWarrior } from '../wellness-warrior/wellnessWarriorModel'

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
		},
		wellness_warrior_id: {
			type: DataTypes.INTEGER
		},
		mentor_matcher_id: { type: DataTypes.INTEGER }
	},
	{
		sequelize,
		tableName: 'search_associations'
	}
)

const onDelete = { onDelete: 'CASCADE' }

User.hasOne(Associations, { foreignKey: 'user_id', as: 'user_associations', ...onDelete })
Associations.belongsTo(FindFriendModel, { foreignKey: 'find_friend_id', as: 'find_friend_associations', ...onDelete })
Associations.belongsTo(WellnessWarrior, {
	foreignKey: 'wellness_warrior_id',
	as: 'wellness_warrior_associations',
	...onDelete
})
Associations.belongsTo(MentorMatcherModel, {
	foreignKey: 'mentor_matcher_id',
	as: 'mentor_matcher_associations',
	...onDelete
})

Associations.sync()
