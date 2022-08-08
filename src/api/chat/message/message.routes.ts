import express, { Application } from 'express'
import { validateReq } from '../../../helper/validationMiddleware'
import { authMiddleware } from '../../helper/authMiddleware'
import { MessageController } from './message.controller'
import { sendMessageValidation, markMessagesAsSeenValidation } from './validation'

const controller = new MessageController()
export const messageRoute = express.Router()

messageRoute.get('/all', authMiddleware, controller.getAllMessages as Application)
messageRoute.get('/unread', authMiddleware, controller.getAllUnreadMessages as Application)
messageRoute.get('/unread/count', authMiddleware, controller.getAllUnreadMessageCount as Application)
messageRoute.get('/subscribe', authMiddleware, controller.subscribeToGetNewIncomingMessageNotification as Application)
messageRoute.post(
	'/send/room/:roomId',
	authMiddleware,
	sendMessageValidation,
	validateReq,
	controller.sendMessage as Application
)
messageRoute.get('/room/:id', authMiddleware, controller.getMessages as Application)
messageRoute.get('/room/subscribe/:roomId', authMiddleware, controller.subscribeToRoom as Application)
messageRoute.put(
	'/read',
	authMiddleware,
	markMessagesAsSeenValidation,
	validateReq,
	controller.markMessagesAsSeen as Application
)
