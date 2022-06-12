import { Request } from "express"
import { UserType } from "../user/interface"
import { UserInformation } from "./userInformationModel"

export type UserInformationType = {
    id: number
    user_id: number
    profile_url: string
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
    twitter: string
    facebook: string
    linkedin: string
    instagram: string
    tiktok: string
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
    fetchById (id: number, userId: number): Promise<UserInformation>
    update (id: number, params: UserInformationType): Promise<UserInformation>
    delete (id: number, userId: number): Promise<number>
}

export interface CreateUserInformationRequest extends Request {
    UserInformationType: UserInformationType
    user:UserType
}

export interface GetUserInformationByUserIdRequest extends Request {
    user_id: number
    user:UserType
}

export interface UpdateUserInformationRequest extends Request {
    user_id: number
    UserInformationType: UserInformationType
    user:UserType
}

export interface DeleteUserInformationRequest extends Request {
    id: number
    user:UserType
}
