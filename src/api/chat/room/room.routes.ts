import express, { Application } from 'express'
import { validateReq } from '../../../helper/validationMiddleware'
import { authMiddleware } from '../../helper/authMiddleware'
import { RoomController } from './room.controller'
import { createRoomValidation } from './validation'

const controller = new RoomController()
export const roomRoute = express.Router()

roomRoute.get('/all', authMiddleware, controller.getAllRooms as Application)
roomRoute.get('/:id', authMiddleware, controller.getRoomById as Application)
roomRoute.post('/', authMiddleware, createRoomValidation, validateReq, controller.createRoom as Application)
roomRoute.put('/join/:id', authMiddleware, controller.joinRoom as Application)
