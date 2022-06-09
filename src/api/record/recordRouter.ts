import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { RecordController } from './recordController'

const recordController = new RecordController()
export const recordRouter = express.Router()

recordRouter.get('/list', recordController.getAllRecords)
recordRouter.get('/allHistory', authMiddleware, recordController.getAllRecordsByUserId as Application)
recordRouter.post('/add', authMiddleware, recordController.createRecord as Application)
recordRouter.put('/update/:id', authMiddleware, recordController.updateRecord as Application)
// recordRouter.delete('/delete/:id', recordController.deleteRecord as Application)
