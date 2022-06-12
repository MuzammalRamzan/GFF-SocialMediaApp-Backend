import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { DebtController } from './debtController'

const debtController = new DebtController()
export const debtRouter = express.Router()

debtRouter.get('/', debtController.getAllDebts)
debtRouter.get('/:id', authMiddleware, debtController.getById as Application)
debtRouter.get('/dueDate/:id', authMiddleware, debtController.getDueDateByDebtId as Application)
debtRouter.post('/add', authMiddleware, debtController.createDebt as Application)
debtRouter.put('/update/:id', authMiddleware, debtController.updateDebt as Application)
debtRouter.delete('/delete/:id', authMiddleware, debtController.deleteDebt as Application)
