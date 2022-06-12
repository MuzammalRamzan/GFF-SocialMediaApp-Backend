import { Request } from "express"
import { IAuthenticatedRequest } from "../helper/authMiddleware"
import { FindFriendModel, IFriendRequest } from './findFriendModel'

export enum RequestStatus {
  SEND = "send",
  APPROVE = "approve",
  REJECT = "reject"
}

export enum RequestType {
  FRIEND = "friend",
  BLOCK = "block"
}

export type FindFriend = {
  id: number
  sender_id: string
  receiver_id: string
  status: RequestStatus
  receiver?: {
    id: number
    firstname: string
    lastname: string
  }
  sender?: {
    id: number
    firstname: string
    lastname: string
  }
}

export interface SearchFriend {
  id: number
  full_name: string,
  user_information: {
    profile_url: string
    bio: string
    date_of_birth: string
    gender: string
    country: string
    job_role: string
    education: string
  }
}

export interface IFindFriendService {
  add(sender_id: number, receiver_id: number): Promise<FindFriendModel>
  approve(request_id: number, user_id: number): Promise<FindFriendModel>
  reject(request_id: number, user_id: number): Promise<FindFriendModel>
  findBySenderIdAndReceiverId(sender_id: number, receiver_id: number): Promise<IFriendRequest>
  friends(userId: number): Promise<FindFriend[]>
  getFriendRequestsBySenderId(sender_id: number): Promise<FindFriend[]>
  getFriendRequestsByReceiverId(receiver_id: number): Promise<FindFriend[]>
  findFriend(searchTerm: string, userId: number): Promise<SearchFriend[]>
}

export interface createFindFriendRequest extends Request, IAuthenticatedRequest {
  body: {
    user_id: number
  }
}

export interface acceptRejectFriendRequest extends Request, IAuthenticatedRequest {
  request_id: number
}