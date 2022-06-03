import { Request } from "express"
import { IAuthenticatedRequest } from "../helper/authMiddleware"
import { FindFriendModel, IFriendRequest } from './findFriendModel'

export enum RequestType {
  SEND = "send",
  APPROVE = "approve",
  REJECT = "reject"
}

export type FindFriend = {
  id: number
  sender_id: string
  receiver_id: string
  request_type: RequestType
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

export interface IFindFriendService {
  add(sender_id: number, receiver_id: number): Promise<FindFriendModel>
  approve(request_id: number, user_id: number): Promise<FindFriendModel>
  reject(request_id: number, user_id: number): Promise<FindFriendModel>
  findBySenderIdAndReceiverId(sender_id: number, receiver_id: number): Promise<IFriendRequest>
  friends(userId: number): Promise<FindFriend[]>
  getFriendRequestsBySenderId(sender_id: number): Promise<FindFriend[]>
  getFriendRequestsByReceiverId(receiver_id: number): Promise<FindFriend[]>
}

export interface createFindFriendRequest extends Request, IAuthenticatedRequest {
  body: {
    receiver_id: number
  }
}

export interface acceptRejectFriendRequest extends Request, IAuthenticatedRequest {
  request_id: number
}