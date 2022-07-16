import { Request, Response } from 'express'
import { Message } from './message.model'

export type MessageType = {
	id: number
	user_id: number
	body: string
	room_id: number
	created_at: Date
	user?: {
		id: number
		full_name: string
		profile_url: string
	}
}

export interface IMessageService {
	getMessagesByRoom(room_id: number): Promise<Message[]>
	getAllMessages(user_id: number): Promise<(MessageType | null)[]>
	getAllUnreadMessageCount(user_id: number): Promise<number>
	sendMessage(message: string, user_id: number, room_id: number): Promise<Message | null>
	getMessages(room_id: number, from: string): Promise<Message[]>
	getAllUnreadMessages(user_id: number): Promise<(MessageType | null)[]>
	subscribeToRoom(req: Request, res: Response, params: { user_id: number; room_id: number }): Promise<void>
	publishMessage(message: Message | null, user_id: number, room_id: number): Promise<void>
}
