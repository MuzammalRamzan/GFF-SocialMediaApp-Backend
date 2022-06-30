import { Request } from 'express'
import { FindFriendRequest } from '../find-friend/interface'
import { IMentorInformation, MentorInformation } from '../mentor-information/mentorInformationModel'
import { IMentorRequest } from '../mentor-matcher/interface'
import { UserInformation } from '../user-information/userInformationModel'
import { WarriorInformation } from '../warrior-information/warriorInformationModel'
import { IWellnessWarriorRequest } from '../wellness-warrior/interface'
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

export interface UserInfo extends User {
	user_information: UserInformation
	warrior_information: WarriorInformation
	mentor_information: MentorInformation
}

export interface OtherUserInfo {
	userInformation: UserInfo | null
	sentFriendRequests: FindFriendRequest[]
	receivedFriendRequests: FindFriendRequest[]
	mentorRequests: IMentorRequest[]
	wellnessWarriorRequests: IWellnessWarriorRequest[]
}

export interface IUserService {
	list(): Promise<User[]>
	fetchById(userId: number, id: number): Promise<User>
	fetchByEmail(email: string, userId: number): Promise<User>
	update(id: number, params: UserType): Promise<User>
	delete(id: number, userId: number): Promise<number>
	searchFriend(search: string, userId: number): Promise<ISearchUser[]>
	fetchFullUserById(userId: number): Promise<User[]>
	getMyInfo(userId: number): Promise<UserInfo | null>
	getOtherUserInfo(userId: number): Promise<OtherUserInfo | null>
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
