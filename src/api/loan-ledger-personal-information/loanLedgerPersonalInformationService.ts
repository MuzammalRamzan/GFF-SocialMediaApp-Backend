import { ILoanLedgerPersonalInformationService, LoanLedgerPersonalInformationType } from "./interface";
import { LoanLedgerPersonalInformation } from "./loanLedgerPersonalInformationModel";

export class LoanLedgerPersonalInformationService implements ILoanLedgerPersonalInformationService {

    async add (params: LoanLedgerPersonalInformationType): Promise<LoanLedgerPersonalInformation> {
        try {
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
        catch (err) {
            throw new Error("Personal information already exists")
        } 
    }

    async list(): Promise<LoanLedgerPersonalInformation[]> {
		const loanPersonalInfos = await LoanLedgerPersonalInformation.findAll()
		return loanPersonalInfos
	}

    async fetchByUserId (params_userId: number, userId:number): Promise<LoanLedgerPersonalInformation[]> {
        if(params_userId !== userId){
            throw new Error("Unauthorized")
        }
        const loanLedgerPersonalInfos = await LoanLedgerPersonalInformation.findAll({
            where: {
                user_id: params_userId
            }
        })
        return loanLedgerPersonalInfos as LoanLedgerPersonalInformation[]
    }

    async fetchById (id: number, userId: number): Promise<LoanLedgerPersonalInformation> {
        const loanLedgerPersonalInfo = await LoanLedgerPersonalInformation.findOne({
            where: {
                id: id,
                user_id: userId 
            }
        })
        if(!loanLedgerPersonalInfo){
            throw new Error("Unauthorized")
        }
        return loanLedgerPersonalInfo as LoanLedgerPersonalInformation
    }

    async update (id: number, params: LoanLedgerPersonalInformationType): Promise<LoanLedgerPersonalInformation> {
        const loan = await LoanLedgerPersonalInformation.findOne({
            where:{
                id: id,
                user_id: params.user_id
            }
        })

        if (!loan){
            throw new Error("Unauthorized")
        }

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
                id: id,
                user_id: params.user_id
            }
        })
        const newUpdatedRow = await LoanLedgerPersonalInformation.findOne({
            where:{
                id: id
            }
        })
        return newUpdatedRow as LoanLedgerPersonalInformation
    }

    async delete (id: number, userId: number): Promise<number> {
        const deletedRow = await LoanLedgerPersonalInformation.destroy({
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