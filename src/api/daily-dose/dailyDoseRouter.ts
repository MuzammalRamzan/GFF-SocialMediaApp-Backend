import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { DailyDoseController } from './dailyDoseController'

const dailyDoseController = new DailyDoseController()
export const dailyDoseRouter = express.Router()

dailyDoseRouter.post('/add', authMiddleware, dailyDoseController.createDose as Application)
