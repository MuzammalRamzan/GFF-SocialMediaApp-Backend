import express, { Application } from 'express'
import { TransactionController } from './transactionController'

const transactionController = new TransactionController()
export const transactionRouter = express.Router()

transactionRouter.get('/list', transactionController.getAllTransactions)
transactionRouter.post('/add', transactionController.createTransaction as Application)
transactionRouter.put('/update/:id', transactionController.updateTransaction as Application)
transactionRouter.delete('/delete/:id', transactionController.deleteTransaction as Application)
