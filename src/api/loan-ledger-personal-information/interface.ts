import { Request } from "express"
import { LoanLedgerPersonalInformation } from "./loanLedgerPersonalInformationModel"

export type LoanLedgerPersonalInformationType = {
    id: number
    user_id: number
    full_name: string
    national_id: string
    date_of_birth: Date
    registration_number: string
    gender: GenderEnum
    email: string
    mobile_phone: string
    current_residence: string
    house_number: string
    country: string
}

export enum GenderEnum {
    Male = "Male",
    Female = "Female",
}

export interface ILoanLedgerPersonalInformationService {
    list (): Promise<LoanLedgerPersonalInformation[]>
    add (params: LoanLedgerPersonalInformationType): Promise<LoanLedgerPersonalInformation>
    fetchByUserId (id: number): Promise<LoanLedgerPersonalInformation[]>
    fetchById (id: number): Promise<LoanLedgerPersonalInformation>
    update (id: number, params: LoanLedgerPersonalInformationType): Promise<[affectedCount: number]>
    delete (id: number): Promise<number>
}

export interface CreateLoanLedgerPersonalInfoRequest extends Request {
    LoanLedgerPersonalInformationType: LoanLedgerPersonalInformationType
}

export interface GetLoanLedgerPersonalInfoByIdRequest extends Request {
    user_id: number
}

export interface GetLoanLedgerPersonalInfoByUserIdRequest extends Request {
    id: number
}

export interface UpdateLoanLedgerPersonalInfoRequest extends Request {
    user_id: number
    LoanLedgerPersonalInformationType: LoanLedgerPersonalInformationType
}

export interface DeleteLoanLedgerPersonalInfoRequest extends Request {
    id: number
}
