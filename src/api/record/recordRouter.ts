import express from 'express'
import { RecordController } from './recordController'

const recordController = new RecordController()
export const recordRouter = express.Router()

recordRouter.get('/list', recordController.getAllRecords)
recordRouter.post('/add', recordController.createRecord as any)
recordRouter.put('/update/:id', recordController.updateRecord as any)
recordRouter.delete('/delete/:id', recordController.deleteRecord as any)
