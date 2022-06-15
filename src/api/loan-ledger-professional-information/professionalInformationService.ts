import { ILoanLedgerProfessionalInformationService, LoanLedgerProfessionalInformationType } from './interface'
import { LoanLedgerProfessionalInformation } from './professionalInformationModel'

export class LoanLedgerProfessionalInformationService implements ILoanLedgerProfessionalInformationService {
	async list(): Promise<LoanLedgerProfessionalInformation[]> {
		const professionalInformation = await LoanLedgerProfessionalInformation.findAll()
		return professionalInformation
	}

	async fetchById(id: number, userId: number): Promise<LoanLedgerProfessionalInformation> {
		const professionalInformation = await LoanLedgerProfessionalInformation.findOne({
			where: {
				id: id,
				user_id: userId
			}
		})

		if(!professionalInformation){
			throw new Error("Unauthorized")
		}
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
		try {
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
		catch(err) {
			throw new Error("Professional information already exists")
		}
	}
		

	async update(id: number, params: LoanLedgerProfessionalInformationType): Promise<LoanLedgerProfessionalInformation> {
		const loan = await LoanLedgerProfessionalInformation.findOne({
            where:{
                id: id,
                user_id: params.user_id
            }
        })

        if (!loan){
            throw new Error("Unauthorized")
        }
		
		await LoanLedgerProfessionalInformation.update(
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
		const newUpdatedRow = await LoanLedgerProfessionalInformation.findOne({
			where:{
                id: id
            }
		})
		return newUpdatedRow as LoanLedgerProfessionalInformation
	}

	async delete(id: number, userId: number): Promise<number> {
		const deletedRow = await LoanLedgerProfessionalInformation.destroy({
			where: {
				id: id,
				user_id: userId
			}
		})
		if(!deletedRow){
            throw new Error("Unauthorized")
        }
        return deletedRow
	}
}
