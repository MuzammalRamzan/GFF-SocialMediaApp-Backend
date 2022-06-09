import { Request } from "express"
import { UserType } from "../user/interface"
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
    fetchByUserId (params_userId: number, userId: number): Promise<LoanLedgerPersonalInformation[]>
    fetchById (id: number, userId: number): Promise<LoanLedgerPersonalInformation>
    update (id: number, params: LoanLedgerPersonalInformationType): Promise<LoanLedgerPersonalInformation>
    delete (id: number, userId: number): Promise<number>
}

export interface CreateLoanLedgerPersonalInfoRequest extends Request {
    LoanLedgerPersonalInformationType: LoanLedgerPersonalInformationType
    user: UserType
}

export interface GetLoanLedgerPersonalInfoByIdRequest extends Request {
    user_id: number
    user: UserType
}

export interface GetLoanLedgerPersonalInfoByUserIdRequest extends Request {
    id: number
    user: UserType
}

export interface UpdateLoanLedgerPersonalInfoRequest extends Request {
    user_id: number
    LoanLedgerPersonalInformationType: LoanLedgerPersonalInformationType
    user: UserType
}

export interface DeleteLoanLedgerPersonalInfoRequest extends Request {
    id: number
    user: UserType
}
