import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../database/index'

export class LoanLedgerProfessionalInformation extends Model {}

LoanLedgerProfessionalInformation.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true
		},
		employment_type: {
			type: DataTypes.STRING,
			allowNull: false
		},
		company_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		profession: {
			type: DataTypes.STRING,
			allowNull: false
		},
		education: {
			type: DataTypes.STRING,
			allowNull: false
		},
		net_monthly_salary: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		work_experience: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		sequelize,
		tableName: 'loan_ledger_professional_information'
	}
)
