import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database'
import { WarriorInformation } from '../warrior-information/warriorInformationModel'
import { MentorInformation } from '../mentor-information/mentorInformationModel'
import { UserInformation } from '../user-information/userInformationModel'
import { UserRole } from '../user-role/userRoleModel'
import { DATABASE_TABLES } from '../../constants/db_tables'

export interface IUser {
	id: number
	email: string
	full_name: string
	phone_number: string
	default_currency_id: number
	role_id: number
	password: string
}

export class User extends Model { }
User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		role_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		full_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		default_currency_id: {
			type: DataTypes.INTEGER,
			defaultValue: 1
		},
		user_feature_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: null
		},
		deactivated: { type: DataTypes.BOOLEAN, defaultValue: 0 },
		is_pro: { type: DataTypes.BOOLEAN, defaultValue: 0 },
		promoted_till: { type: DataTypes.DATE, defaultValue: null },
		forgot_password_token: { type: DataTypes.STRING, defaultValue: null },
	},
	{
		sequelize,
		tableName: DATABASE_TABLES.USER,
		timestamps: true
	}
)

User.belongsTo(UserRole, { foreignKey: 'role_id', as: 'role' })

User.hasOne(WarriorInformation, {
	foreignKey: 'user_id',
	as: 'warrior_information'
})
WarriorInformation.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

User.hasOne(MentorInformation, {
	foreignKey: 'user_id',
	as: 'mentor_information'
})
MentorInformation.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

User.hasOne(UserInformation, {
	foreignKey: 'user_id',
	as: 'user_information'
})

User.sync()
