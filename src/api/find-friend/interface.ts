import { Request } from 'express'
import { IAuthenticatedRequest } from '../helper/authMiddleware'
import { FindFriendModel, IFriendRequest } from './findFriendModel'

export enum RequestStatus {
	SEND = 'send',
	APPROVE = 'approve',
	REJECT = 'reject'
}

export enum RequestType {
	FRIEND = 'friend',
	BLOCK = 'block'
}

export type FindFriendRequest = {
	id: number
	sender_id: string
	receiver_id: string
	status: RequestStatus
	receiver?: FriendUser
	sender?: FriendUser
	request_type: RequestType
	block_reason?: string
}

export interface FindFriendAssociation {
	id: number
	find_friend_associations: FindFriendModel
}

export interface FriendUser {
	id: number
	full_name: string
	user_information: {
		profile_url: string
		bio: string
		date_of_birth: string
		gender: string
		country: string
		job_role: string
		education: string
	}
	user_associations?: FindFriendAssociation
}

export type FriendRequestWithUserInformation = {
	user: FriendUser
	friend_request: FindFriendRequest
}

export interface IFindFriendService {
	add(sender_id: number, receiver_id: number): Promise<FindFriendModel>
	approve(request_id: number, user_id: number): Promise<FindFriendModel>
	reject(request_id: number, user_id: number): Promise<FindFriendModel>
	findBySenderIdAndReceiverId(sender_id: number, receiver_id: number): Promise<IFriendRequest>
	friends(userId: number): Promise<FindFriendRequest[]>
	getFriendRequestsBySenderId(sender_id: number): Promise<FindFriendRequest[]>
	getFriendRequestsByReceiverId(receiver_id: number): Promise<FindFriendRequest[]>
	findFriend(searchTerm: string, userId: number): Promise<FriendUser[]>
	getFriendRequestById(id: number): Promise<FindFriendRequest>
	blockFriend(sender_id: number, receiver_id: number, reason: string): Promise<FindFriendModel>
	unblockFriend(sender_id: number, receiver_id: number): Promise<boolean>
	getBlockedFriends(userId: number): Promise<FindFriendRequest[]>
	getFriendByUserId(loggedInUserId: number, userId: number): Promise<FriendRequestWithUserInformation>
	isBlocked(sender_id: number, receiver_id: number): Promise<IFriendRequest>
	areUsersFriend(sender_id: number, receiver_id: number): Promise<boolean>
}

export interface createFindFriendRequest extends Request, IAuthenticatedRequest {
	body: {
		user_id: number
	}
}

export interface acceptRejectFriendRequest extends Request, IAuthenticatedRequest {
	request_id: number
}
