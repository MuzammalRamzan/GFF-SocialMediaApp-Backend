import { Request, Response } from 'express'
import { Message } from './message.model'

export type MessageType = {
	id: number
	user_id: number
	body: string
	room_id: number
	created_at: Date | number
	user?: {
		id: number
		full_name: string
		profile_url: string
	}
}

export interface IMessageService {
	getMessagesByRoom(room_id: number): Promise<Message[]>
	getAllMessages(user_id: number, to?: string, from?: string): Promise<(MessageType | null)[]>
	getAllUnreadMessageCount(user_id: number): Promise<number>
	sendMessage(message: string, user_id: number, room_id: number): Promise<Message | null>
	getMessages(room_id: number, to: string, from: string): Promise<Message[]>
	getAllUnreadMessages(user_id: number, timestamp?: number): Promise<(MessageType | null)[]>
	subscribeToRoom(req: Request, res: Response, params: { user_id: number; room_id: number }): Promise<void>
	subscribeToGetNewIncomingMessageNotification(req: Request, res: Response, user_id: number): Promise<void>
	publishMessage(message: Message | null, user_id: number, room_id: number): Promise<void>
	markMessagesAsSeen(messageIds: number[]): Promise<void>
}
