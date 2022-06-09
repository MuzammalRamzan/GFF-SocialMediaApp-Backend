import { Request } from 'express'
import { UserType } from '../user/interface'
import { LoanLedgerProfessionalInformation } from './professionalInformationModel'

export type LoanLedgerProfessionalInformationType = {
	id: number
	user_id: number
	employment_type: string
	company_name: string
	profession: string
	education: string
	net_monthly_salary: number
	work_experience: string
}

export interface CreateLoanLedgerProfessionalInformationRequest extends Request {
	LoanLedgerProfessionalInformationParams: LoanLedgerProfessionalInformationType
	user: UserType
}

export interface GetLoanLedgerProfessionalInformationByIdRequest extends Request {
	id: number
	user: UserType
}

export interface GetLoanLedgerProfessionalInformationByUserIdRequest extends Request {
	user: UserType
}

export interface UpdateLoanLedgerProfessionalInformationRequest extends Request {
	id: number
	LoanLedgerProfessionalInformationParams: LoanLedgerProfessionalInformationType
	user: UserType
}

export interface DeleteLoanLedgerProfessionalInformationRequest extends Request {
	id: number
	user: UserType
}

export interface ILoanLedgerProfessionalInformationService {
	list(): Promise<LoanLedgerProfessionalInformation[]>
	fetchById(id: number, userId: number): Promise<LoanLedgerProfessionalInformation>
	fetchByUserId(user_id: number): Promise<LoanLedgerProfessionalInformation[]>
	add(params: LoanLedgerProfessionalInformationType): Promise<LoanLedgerProfessionalInformation>
	update(id: number, params: LoanLedgerProfessionalInformationType): Promise<LoanLedgerProfessionalInformation>
	delete(id: number, userId: number): Promise<number>
}
