import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { CrewController } from './crewController'

const crewController = new CrewController()
export const crewRouter = express.Router()

crewRouter.get('/crews', authMiddleware, crewController.getAllCrew as Application)
crewRouter.post('/create', authMiddleware, crewController.createCrew as Application)
crewRouter.get('/:id', authMiddleware, crewController.getCrewById as Application)
crewRouter.put('/update/:id', authMiddleware, crewController.updateCrew as Application)
crewRouter.delete('/delete/:id', authMiddleware, crewController.deleteCrew as Application)
