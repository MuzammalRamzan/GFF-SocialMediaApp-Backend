import { Request } from 'express'
import { PaginationType } from '../../helper/db.helper'
import { FindFriendModel } from '../find-friend/findFriendModel'
import { Hashtag } from '../hashtag/hashtagModel'
import { MentorInformation } from '../mentor-information/mentorInformationModel'
import { MentorMatcherModel } from '../mentor-matcher/mentorMatcherModel'
import { UserInformation } from '../user-information/userInformationModel'
import { WarriorInformation } from '../warrior-information/warriorInformationModel'
import { WellnessWarrior } from '../wellness-warrior/wellnessWarriorModel'
import { User } from './userModel'

export type UserType = {
	default_currency_id: number
	email: string
	full_name: string
	id: number
	password: string
	role_id: number
	user_feature_id: number
	deactivated?: boolean
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
	hashtags: Hashtag[]
}

export interface OtherUserInfo {
	user_information: UserInformation | undefined
	warrior_information: WarriorInformation | undefined
	mentor_information: MentorInformation | undefined
	friend_request: FindFriendModel | null
	mentor_request: MentorMatcherModel | null
	warrior_request: WellnessWarrior | null
	hashtags: Hashtag[]
}

export type PaginatedUserResult = { rows: User[]; count: number; page?: number; pageSize?: number }

export interface IUserService {
	list(role: string | undefined, pagination: PaginationType): Promise<PaginatedUserResult>
	fetchById(userId: number, id: number): Promise<User>
	fetchByEmail(email: string, userId: number): Promise<User>
	update(id: number, params: UserType): Promise<User>
	delete(id: number, userId: number): Promise<number>
	searchFriend(search: string, userId: number): Promise<ISearchUser[]>
	fetchFullUserById(userId: number): Promise<User[]>
	getMyInfo(userId: number): Promise<UserInfo | null>
	getOtherUserInfo(userId: number, otherUserId: number): Promise<OtherUserInfo | null>
	deactivateUserAccount(userId: number): Promise<User>
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
