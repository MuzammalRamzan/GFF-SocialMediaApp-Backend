import express from 'express'
import { DebtController } from './debtController'

const debtController = new DebtController()
export const debtRouter = express.Router()

debtRouter.get('/', debtController.getAllDebts)
debtRouter.get('/:id', debtController.getById)
debtRouter.get('/dueDate/:id', debtController.getDueDateByDebtId)
debtRouter.post('/add', debtController.createDebt)
debtRouter.put('/update/:id', debtController.updateDebt)
debtRouter.delete('/delete/:id', debtController.deleteDebt)
