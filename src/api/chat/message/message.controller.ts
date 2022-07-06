import { NextFunction, Request, Response } from 'express'
import { IAuthenticatedRequest } from '../../helper/authMiddleware'
import { RoomService } from '../room/room.service'
import { MessageService } from './message.service'

export class MessageController {
	private messageService: MessageService

	constructor() {
		this.messageService = new MessageService()
	}

	sendMessage = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const message = req.body.message
			const user_id = req?.user?.id as number
			const room_id = +req.params.roomId

			const isUserBelongToTheRoom = await RoomService.isUserBelongToTheRoom(room_id, user_id)

			if (!isUserBelongToTheRoom) {
				return res.status(403).json({
					message: 'You are not belong to the room',
					code: 403
				})
			}

			await this.messageService.sendMessage(message, user_id, room_id)
			// return res.status(200).json({
			// 	data: { message },
			// 	message: 'Message sent successfully',
			// 	code: 200
			// })
		} catch (error) {
			next(error)
		}
	}

	getMessages = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const room_id = +req.params.id
			const from = req.query.from as string

			const messages = await this.messageService.getMessages(room_id, from)
			return res.status(200).json({
				data: { messages },
				message: 'Messages fetched successfully',
				code: 200
			})
		} catch (error) {
			next(error)
		}
	}

	subscribeToRoom = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const user_id = req?.user?.id as number
			const room_id = +req.params.roomId

			return this.messageService.subscribeToRoom(req, res, { user_id, room_id })
		} catch (error) {
			next(error)
		}
	}
}
