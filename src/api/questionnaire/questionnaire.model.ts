import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'
import { Meeting } from '../meetings/meeting.model'
import { QuestionType } from './interface'

export class Questionnaire extends Model { }
Questionnaire.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		question: {
			type: DataTypes.STRING,
			allowNull: false
		},
		role_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		type: {
			type: DataTypes.ENUM(...Object.values(QuestionType)),
			allowNull: false
		},
		rank: {
			type: DataTypes.INTEGER,
			allowNull: true,
		}
	},
	{ sequelize: sequelize, tableName: 'questionnaire' }
)

export class QuestionnaireAnswers extends Model { }
QuestionnaireAnswers.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		question_id: { type: DataTypes.INTEGER, allowNull: false },
		answer: { type: DataTypes.STRING, allowNull: false },
		user_id: { type: DataTypes.INTEGER, allowNull: false },
		meeting_id: { type: DataTypes.INTEGER }
	},
	{ sequelize: sequelize, tableName: 'questionnaire_answers' }
)

QuestionnaireAnswers.belongsTo(Questionnaire, { as: 'question', foreignKey: 'question_id' })
Questionnaire.hasMany(QuestionnaireAnswers, { as: 'answers', foreignKey: 'question_id' })

Meeting.hasMany(QuestionnaireAnswers, { as: 'answers', foreignKey: 'meeting_id' })

Questionnaire.sync()
QuestionnaireAnswers.sync()
