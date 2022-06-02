import express, { Application } from 'express'
import { DebtController } from './debtController'

const debtController = new DebtController()
export const debtRouter = express.Router()

debtRouter.get('/', debtController.getAllDebts)
debtRouter.get('/:id', debtController.getById as Application)
debtRouter.get('/dueDate/:id', debtController.getDueDateByDebtId as Application)
debtRouter.post('/add', debtController.createDebt as Application)
debtRouter.put('/update/:id', debtController.updateDebt as Application)
debtRouter.delete('/delete/:id', debtController.deleteDebt as Application)
