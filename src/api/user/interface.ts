import { Request } from 'express'
import { MentorInformationType } from '../mentor-information/interface'
import { IMentorInformation } from '../mentor-information/mentorInformationModel'
import { UserInformation } from '../user-information/userInformationModel'
import { IWarriorUser } from '../warrior-information/interface'
import { User } from './userModel'

export type UserType = {
	default_currency_id: number
	email: string
	full_name: string
	id: number
	password: string
	role_id: number
	user_feature_id: number
}

export interface ISearchUser {
	id: number
	firstname: string
	lastname: string
}

export type UserInfoType = {
	user: User
	userInformation: UserInformation
	warriorInformation: IWarriorUser
	mentorInformation: IMentorInformation
}

export interface IUserService {
	list(): Promise<User[]>
	fetchById(userId: number, id: number): Promise<User>
	fetchByEmail(email: string, userId: number): Promise<User>
	update(id: number, params: UserType): Promise<User>
	delete(id: number, userId: number): Promise<number>
	searchFriend(search: string, userId: number): Promise<ISearchUser[]>
	fetchFullUserById(userId: number): Promise<User[]>
	getMyInfo(userId: number): Promise<UserInfoType>
}

export interface GetUsersByIdRequest extends Request {
	user: UserType
	id: number
}

export interface GetUsersByEmailRequest extends Request {
	email: string
	user: UserType
}

export interface GetFullUserByUserIdRequest extends Request {
	user: UserType
}

export interface UpdateUserRequest extends Request {
	id: number
	user: UserType
}

export interface DeleteUserRequest extends Request {
	id: number
	user: UserType
}
