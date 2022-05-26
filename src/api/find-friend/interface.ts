import { Request } from "express"
import { FindFriendModel } from './findFriendModel'

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
}

export interface IFindFriendService {
  add(sender_id: number, receiver_id: number): Promise<FindFriendModel>
  approve(request_id: number): Promise<FindFriendModel>
}

export interface createFindFriendRequest extends Request {
  body: {
    sender_id: number
    receiver_id: number
  }
}
export interface acceptRejectFriendRequest extends Request {
  request_id: number
}