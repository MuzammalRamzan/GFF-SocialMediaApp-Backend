import { Request } from "express"
import { UserInformation } from "./userInformationModel"

export type UserInformationType = {
    id: number
    user_id: number
    bio: string
    date_of_birth: Date
    gender: GenderEnum
    email: string
    phone_number: string
    country: string
    city: string
    state: string
    zip_code: number
    address: string
    hashtags: string
    social_media: string
    employer_name: string
    job_role: string
    education: string
    other_education: string
    profile_role: ProfileRoleEnum
}

export enum GenderEnum {
    Male = "Male",
    Female = "Female",
    Other = "Other"
}

export enum ProfileRoleEnum {
    Employer = "Employer",
    Mentor = "Mentor",
    WellnessWarrior = "Wellness Warrior"
}

export interface IUserInformationService {
    add (params: UserInformationType): Promise<UserInformation>
    fetchById (id: number): Promise<UserInformation>
    update (id: number, params: UserInformationType): Promise<[affectedCount: number]>
    delete (id: number): Promise<number>
}

export interface CreateUserInformationRequest extends Request {
    UserInformationType: UserInformationType
}

export interface GetUserInformationByUserIdRequest extends Request {
    user_id: number
}

export interface UpdateUserInformationRequest extends Request {
    user_id: number
    UserInformationType: UserInformationType
}

export interface DeleteUserInformationRequest extends Request {
    id: number
}
