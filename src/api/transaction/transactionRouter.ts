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
transactionRouter.put('/paid/:id', authMiddleware, transactionController.markTransactionAsPaid as Application)
transactionRouter.get('/due', authMiddleware, transactionController.getOverDueTransactions as Application)
transactionRouter.get('/paid', authMiddleware, transactionController.getPaidTransactions as Application)
transactionRouter.get('/cancel/:id', authMiddleware, transactionController.cancelRecurringTransaction as Application)
