import express from 'express'
import { body } from 'express-validator'
import { authMiddleware } from '../helper/authMiddleware'
import { WellnessWarriorController } from './wellnessWarriorController'

export const warriorRouter = express.Router()

const requiredWarriorId = body('warrior_id', 'Warrior id is required').isNumeric()
const requiredRequestId = body('request_id', 'Request id is required').isNumeric()

const controller = new WellnessWarriorController()

warriorRouter.get('/search', authMiddleware, controller.searchWellnessWarriors)
warriorRouter.post('/send-request', authMiddleware, requiredWarriorId, controller.sendRequest)
warriorRouter.post('/approve-request', authMiddleware, requiredRequestId, controller.approveRequest)
warriorRouter.post('/reject-request', authMiddleware, requiredRequestId, controller.rejectRequest)
warriorRouter.delete('/', authMiddleware, controller.removeWarrior)
warriorRouter.get('/request/:request_id', authMiddleware, controller.getRequest)
warriorRouter.get('/all-request', authMiddleware, controller.getAllRequests)
warriorRouter.get('/all-sended-request', authMiddleware, controller.getAllSendedRequests)
warriorRouter.post('/favorite-warrior', authMiddleware, requiredWarriorId, controller.favoriteWellnessWarrior)
warriorRouter.post('/unfavorite-warrior', authMiddleware, requiredWarriorId, controller.unfavoriteWellnessWarrior)
warriorRouter.get('/all-favorite-warrior', authMiddleware, controller.getFavoriteWellnessWarriors)
warriorRouter.get('/my-warriors', authMiddleware, controller.getMyWarriors)
