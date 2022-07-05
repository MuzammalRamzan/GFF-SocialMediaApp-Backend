import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { UserInformation } from '../../user-information/userInformationModel'
import { User } from '../../user/userModel'
import { Message } from './message.model'

type SubscribersType = {
	[room_id: string]: { [user_id: string]: Response | null }
}

export class MessageService {
	private subscribers: SubscribersType = Object.create(null)

	public async sendMessage(message: string, user_id: number, room_id: number): Promise<Message> {
		const messageObj = new Message()

		this.publishMessage(message, user_id, room_id)

		return messageObj
	}

	public async getMessages(room_id: number, from: string): Promise<Message[]> {
		const from_date = new Date(from)

		return await Message.findAll({
			where: {
				room_id,
				created_at: {
					[Op.gte]: from_date
				}
			},
			order: [['created_at', 'ASC']],
			include: [
				{
					model: User,
					as: 'user',
					attributes: ['id', 'full_name'],
					include: [
						{
							model: UserInformation,
							as: 'user_information',
							attributes: ['profile_url']
						}
					]
				}
			]
		})
	}

	public async subscribeToRoom(
		req: Request,
		res: Response,
		params: { user_id: number; room_id: number }
	): Promise<void> {
		const { user_id, room_id } = params

		res.setHeader('Content-Type', 'application/json;charset=utf-8')
		res.setHeader('Cache-Control', 'no-cache, must-revalidate')

		if (!this.subscribers[room_id]) {
			this.subscribers[room_id] = {}
		}

		this.subscribers[room_id][user_id] = res

		req.on('close', () => {
			delete this.subscribers[room_id][user_id]
		})
	}

	public async publishMessage(message: string, user_id: number, room_id: number): Promise<void> {
		if (this.subscribers[room_id] && Object.keys(this.subscribers[room_id]).length) {
			let roomParticipants = Object.keys(this.subscribers[room_id]).filter(userId => +userId !== user_id)
			roomParticipants.map(participantId => {
				if (this.subscribers[room_id][participantId]) {
					this.subscribers[room_id][participantId]?.end(JSON.stringify({ user_id, message }))
				}
				this.subscribers[room_id][participantId] = null
			})
		}
	}
}
