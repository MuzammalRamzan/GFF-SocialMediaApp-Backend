import { Request } from 'express'
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
}

export interface GetLoanLedgerProfessionalInformationByIdRequest extends Request {
	id: number
}

export interface GetLoanLedgerProfessionalInformationByUserIdRequest extends Request {
	id: number
}

export interface UpdateLoanLedgerProfessionalInformationRequest extends Request {
	id: number
	LoanLedgerProfessionalInformationParams: LoanLedgerProfessionalInformationType
}

export interface DeleteLoanLedgerProfessionalInformationRequest extends Request {
	id: number
}

export interface ILoanLedgerProfessionalInformationService {
	list(): Promise<LoanLedgerProfessionalInformation[]>
	fetchById(id: number): Promise<LoanLedgerProfessionalInformation>
	fetchByUserId(user_id: number): Promise<LoanLedgerProfessionalInformation[]>
	add(params: LoanLedgerProfessionalInformationType): Promise<LoanLedgerProfessionalInformation>
	update(id: number, params: LoanLedgerProfessionalInformationType): Promise<[affectedCount: number]>
	delete(id: number): Promise<number>
}
