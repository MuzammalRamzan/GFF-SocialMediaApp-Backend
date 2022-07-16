import { MessageTagList } from 'aws-sdk/clients/sesv2'
import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { IAuthenticatedRequest } from '../../helper/authMiddleware'
import { UserInformation } from '../../user-information/userInformationModel'
import { User } from '../../user/userModel'
import { Room } from '../room/room.model'
import { RoomService } from '../room/room.service'
import { IMessageService, MessageType } from './interface'
import { Message } from './message.model'

type SubscribersType = {
	[room_id: string]: { [user_id: string]: Response | null }
}

export class MessageService implements IMessageService {
	private subscribers: SubscribersType = Object.create(null)
	private incomingMessageNotificationSubscribers: { [user_id: string]: Response | null } = Object.create(null)

	private readonly roomService: RoomService

	constructor() {
		this.roomService = new RoomService()
	}

	static filterMessageObject(message: Message | null): MessageType | null {
		if (!message) return null

		const data = message?.get()
		return {
			id: data.id,
			user_id: data.user_id,
			body: data.body,
			room_id: data.room_id,
			created_at: data.created_at,
			user: {
				id: data.user.id,
				full_name: data.user.full_name,
				profile_url: data.user?.user_information?.profile_url
			}
		}
	}

	public async getMessagesByRoom(room_id: number): Promise<Message[]> {
		return await Message.findAll({
			where: {
				room_id
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

	public async getAllMessages(user_id: number): Promise<(MessageType | null)[]> {
		const roomService = new RoomService()
		const getAllRooms = await roomService.getAllRooms(user_id)
		const messages = []

		for (let room of getAllRooms) {
			const getMessages = await this.getMessagesByRoom(room.get('id') as number)
			for (let message of getMessages) {
				messages.push(MessageService.filterMessageObject(message))
			}
		}

		return messages
	}

	public async sendMessage(message: string, user_id: number, room_id: number): Promise<Message | null> {
		let messageObj: Message | null = await Message.create({ user_id, room_id, body: message })

		messageObj = await Message.findByPk(messageObj.getDataValue('id'), {
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

		this.publishMessage(messageObj, user_id, room_id)
		this.sendMessageNotification(messageObj)

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

	public async getAllUnreadMessageCount(user_id: number): Promise<number> {
		const unreadMessageCount = await Message.count({
			where: { user_id: { [Op.ne]: user_id }, read: 0 },
			include: [
				{
					model: Room,
					as: 'room',
					required: true,
					where: {
						user_ids: {
							[Op.or]: [
								{
									[Op.like]: `%${user_id},%`
								},
								{
									[Op.like]: `%,${user_id}`
								}
							]
						}
					}
				}
			]
		})
		return unreadMessageCount
	}

	public async getAllUnreadMessages(user_id: number): Promise<(MessageType | null)[]> {
		const unreadMessages = await Message.findAll({
			where: { user_id: { [Op.ne]: user_id }, read: 0 },
			include: [
				{
					model: Room,
					as: 'room',
					required: true,
					where: {
						user_ids: {
							[Op.or]: [
								{
									[Op.like]: `%${user_id},%`
								},
								{
									[Op.like]: `%,${user_id}`
								}
							]
						}
					}
				},
				{
					model: User,
					as: 'user',
					include: [{ model: UserInformation, as: 'user_information', attributes: ['profile_url'] }]
				}
			]
		})

		return unreadMessages.map(msg => MessageService.filterMessageObject(msg))
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

		setTimeout(() => {
			req.pause()
			res.status(502).end()
		}, 30000)

		req.on('close', () => {
			delete this.subscribers[room_id][user_id]
		})
	}

	public async subscribeToGetNewIncomingMessageNotification(
		req: IAuthenticatedRequest,
		res: Response,
		user_id: number
	): Promise<void> {
		res.setHeader('Content-Type', 'application/json;charset=utf-8')
		res.setHeader('Cache-Control', 'no-cache, must-revalidate')

		this.incomingMessageNotificationSubscribers[user_id] = res

		setTimeout(() => {
			req.pause()
			res.status(502).end()
		}, 30000)

		req.on('close', () => {
			delete this.incomingMessageNotificationSubscribers[user_id]
		})
	}

	public async publishMessage(message: Message | null, user_id: number, room_id: number): Promise<void> {
		if (message && this.subscribers[room_id] && Object.keys(this.subscribers[room_id]).length) {
			let roomParticipants = Object.keys(this.subscribers[room_id]).filter(userId => +userId !== user_id)

			roomParticipants.map(participantId => {
				if (this.subscribers[room_id][participantId]) {
					this.subscribers[room_id][participantId]?.end(
						JSON.stringify({
							code: 200,
							data: { messages: [MessageService.filterMessageObject(message)] },
							message: 'Received a message!'
						})
					)
				}
				this.subscribers[room_id][participantId] = null
			})
		}
	}

	public async sendMessageNotification(message: Message | null): Promise<void> {
		if (message) {
			let roomParticipants = await this.roomService.getAllUsersByRoomId(message.getDataValue('room_id'))

			roomParticipants = roomParticipants.filter(userId => +userId !== message.getDataValue('user_id'))

			roomParticipants.map(userId => {
				if (this.incomingMessageNotificationSubscribers[userId]) {
					this.incomingMessageNotificationSubscribers[userId]?.end(
						JSON.stringify({
							code: 200,
							data: { messages: [MessageService.filterMessageObject(message)] },
							message: 'Received a message!'
						})
					)
				}
			})
		}
	}
}
