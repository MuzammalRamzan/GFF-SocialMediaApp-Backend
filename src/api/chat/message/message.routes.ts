import express, { Application } from 'express'
import { authMiddleware } from '../../helper/authMiddleware'
import { MessageController } from './message.controller'

const controller = new MessageController()
export const messageRoute = express.Router()

messageRoute.post('/send/room/:roomId', authMiddleware, controller.sendMessage as Application)
messageRoute.get('/room/:id', authMiddleware, controller.getMessages as Application)
messageRoute.get('/room/subscribe/:roomId', authMiddleware, controller.subscribeToRoom as Application)
