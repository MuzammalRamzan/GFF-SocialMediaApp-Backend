import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'
import { Questions } from '../mentor-questionnaire/questionnaireModel'
import { User } from '../user/userModel'

export class MentorAnswers extends Model {}
MentorAnswers.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		question_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		answer: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		sequelize,
		tableName: 'mentorAnswers'
	}
)

MentorAnswers.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' })
MentorAnswers.belongsTo(Questions, { foreignKey: 'question_id', as: 'question', onDelete: 'CASCADE' })

MentorAnswers.sync()
