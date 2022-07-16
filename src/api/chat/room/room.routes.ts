import express, { Application } from 'express';
import { authMiddleware } from '../../helper/authMiddleware';
import { RoomController } from './room.controller';

const controller = new RoomController()
export const roomRoute = express.Router();

roomRoute.get('/:id', authMiddleware, controller.getRoomById as Application);
roomRoute.get('/all', authMiddleware, controller.getAllRooms as Application);
roomRoute.post('/', authMiddleware, controller.createRoom as Application);
roomRoute.put('/join/:id', authMiddleware, controller.joinRoom as Application);