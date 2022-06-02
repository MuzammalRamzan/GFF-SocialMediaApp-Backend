import express, { Application } from 'express'
import { RecordController } from './recordController'

const recordController = new RecordController()
export const recordRouter = express.Router()

recordRouter.get('/list', recordController.getAllRecords)
recordRouter.post('/add', recordController.createRecord as Application)
recordRouter.put('/update/:id', recordController.updateRecord as Application)
recordRouter.delete('/delete/:id', recordController.deleteRecord as Application)
