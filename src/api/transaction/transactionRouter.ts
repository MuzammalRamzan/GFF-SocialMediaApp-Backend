import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { TransactionController } from './transactionController'

const transactionController = new TransactionController()
export const transactionRouter = express.Router()

transactionRouter.get('/list', transactionController.getAllTransactions)
transactionRouter.post('/add', authMiddleware, transactionController.createTransaction as Application)
transactionRouter.put('/update/:id', authMiddleware, transactionController.updateTransaction as Application)
transactionRouter.delete('/delete/:id', authMiddleware, transactionController.deleteTransaction as Application)
transactionRouter.get('/user', authMiddleware, transactionController.getAllTransactionsForUser as Application)
