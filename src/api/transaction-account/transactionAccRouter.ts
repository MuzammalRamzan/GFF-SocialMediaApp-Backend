import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { TransactionAccController } from './transactionAccController'

const transactionAccController = new TransactionAccController()
export const transactionAccRouter = express.Router()

transactionAccRouter.get('/list', transactionAccController.getAllTransactionAccounts)
transactionAccRouter.get('/id/:id', authMiddleware, transactionAccController.getTransactionAccountById as Application)
transactionAccRouter.get('/user', authMiddleware, transactionAccController.getAllTransactionAccountsForUser as Application)
transactionAccRouter.post('/add', authMiddleware, transactionAccController.createTransactionAccount as Application)
transactionAccRouter.put('/update/:id', authMiddleware, transactionAccController.updateTransaction as Application)
transactionAccRouter.delete('/delete/:id', authMiddleware, transactionAccController.deleteTransactionAccount as Application)
