import { Request } from "express"
import { FindFriendModel } from './findFirendModel'

export type FindFriend = {
  id: number
  sender_id: string
  receiver_id: string
  is_approved: boolean
}

export interface IFindFriendService {
  add(sender_id: number, receiver_id: number): Promise<FindFriendModel>
}

export interface createFindFriendRequest extends Request {
  body: {
    sender_id: number
    receiver_id: number
  }
}