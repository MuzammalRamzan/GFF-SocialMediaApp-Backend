import { ILoanLedgerPersonalInformationService, LoanLedgerPersonalInformationType } from "./interface";
import { LoanLedgerPersonalInformation } from "./loanLedgerPersonalInformationModel";

export class LoanLedgerPersonalInformationService implements ILoanLedgerPersonalInformationService {

    async add (params: LoanLedgerPersonalInformationType): Promise<LoanLedgerPersonalInformation> {
        const loanLedgerPersonalInformation = await LoanLedgerPersonalInformation.create({ 
            user_id: params.user_id,
            full_name: params.full_name,
            national_id: params.national_id,
            date_of_birth: params.date_of_birth,
            registration_number: params.registration_number,
            gender: params.gender,
            email: params.email,
            mobile_phone: params.mobile_phone,
            current_residence: params.current_residence,
            house_number: params.house_number,
            country: params.country
        })

        return loanLedgerPersonalInformation
    }

    async list(): Promise<LoanLedgerPersonalInformation[]> {
		const loanPersonalInfos = await LoanLedgerPersonalInformation.findAll()
		return loanPersonalInfos
	}

    async fetchByUserId (user_id: number): Promise<LoanLedgerPersonalInformation[]> {
        const loanLedgerPersonalInfos = await LoanLedgerPersonalInformation.findAll({
            where: {
                user_id: user_id
            }
        })

        return loanLedgerPersonalInfos as LoanLedgerPersonalInformation[]
    }

    async fetchById (id: number): Promise<LoanLedgerPersonalInformation> {
        const loanLedgerPersonalInfo = await LoanLedgerPersonalInformation.findOne({
            where: {
                id: id
            }
        })

        return loanLedgerPersonalInfo as LoanLedgerPersonalInformation
    }

    async update (id: number, params: LoanLedgerPersonalInformationType): Promise<[affectedCount: number]> {
        const updatedRow = await LoanLedgerPersonalInformation.update({
            user_id: params.user_id,
            full_name: params.full_name,
            national_id: params.national_id,
            date_of_birth: params.date_of_birth,
            registration_number: params.registration_number,
            gender: params.gender,
            email: params.email,
            mobile_phone: params.mobile_phone,
            current_residence: params.current_residence,
            house_number: params.house_number,
            country: params.country
        },
        {
            where: {
                id: id
            }
        })

        return updatedRow
    }

    async delete (id: number): Promise<number> {
        const deletedRow = await LoanLedgerPersonalInformation.destroy({
            where: {
                id: id
            }
        })

        return deletedRow
    }
}