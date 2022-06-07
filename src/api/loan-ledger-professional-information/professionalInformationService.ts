import { ILoanLedgerProfessionalInformationService, LoanLedgerProfessionalInformationType } from './interface'
import { LoanLedgerProfessionalInformation } from './professionalInformationModel'

export class LoanLedgerProfessionalInformationService implements ILoanLedgerProfessionalInformationService {
	async list(): Promise<LoanLedgerProfessionalInformation[]> {
		const professionalInformation = await LoanLedgerProfessionalInformation.findAll()
		return professionalInformation
	}

	async fetchById(id: number): Promise<LoanLedgerProfessionalInformation> {
		const professionalInformation = await LoanLedgerProfessionalInformation.findOne({
			where: {
				id: id
			}
		})

		return professionalInformation as LoanLedgerProfessionalInformation
	}

	async fetchByUserId(user_id: number): Promise<LoanLedgerProfessionalInformation[]> {
		const professionalInformation = await LoanLedgerProfessionalInformation.findAll({
			where: {
				user_id: user_id
			}
		})

		return professionalInformation as LoanLedgerProfessionalInformation[]
	}

	async add(params: LoanLedgerProfessionalInformationType): Promise<LoanLedgerProfessionalInformation> {
		const professionalInformation = await LoanLedgerProfessionalInformation.create({
			user_id: params.user_id,
			employment_type: params.employment_type,
			company_name: params.company_name,
			profession: params.profession,
			education: params.education,
			net_monthly_salary: params.net_monthly_salary,
			work_experience: params.work_experience
		})
		return professionalInformation
	}

	async update(id: number, params: LoanLedgerProfessionalInformationType): Promise<[affectedCount: number]> {
		const professionalInformation = await LoanLedgerProfessionalInformation.update(
			{
				user_id: params.user_id,
				employment_type: params.employment_type,
				company_name: params.company_name,
				profession: params.profession,
				education: params.education,
				net_monthly_salary: params.net_monthly_salary,
				work_experience: params.work_experience
			},
			{
				where: {
					id: id
				}
			}
		)
		return professionalInformation
	}

	async delete(id: number): Promise<number> {
		const professionalInformation = await LoanLedgerProfessionalInformation.destroy({
			where: {
				id: id
			}
		})
		return professionalInformation
	}
}
