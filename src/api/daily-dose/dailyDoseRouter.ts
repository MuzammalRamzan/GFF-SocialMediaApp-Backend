import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { DailyDoseController } from './dailyDoseController'
import multer from 'multer'
const dailyDoseController = new DailyDoseController()
export const dailyDoseRouter = express.Router()

dailyDoseRouter.post('/add', authMiddleware, multer().single('Image'), dailyDoseController.createDose as Application)
dailyDoseRouter.get('/getByCategory', authMiddleware, dailyDoseController.getByCategory as Application)
dailyDoseRouter.put(
	'/update/:id',
	authMiddleware,
	multer().single('Image'),
	dailyDoseController.updateDose as Application
)
dailyDoseRouter.delete('/delete/:id', authMiddleware, dailyDoseController.deleteDose as Application)
