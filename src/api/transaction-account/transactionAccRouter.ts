import express, { Application } from 'express'
import { TransactionAccController } from './transactionAccController'

const transactionAccController = new TransactionAccController()
export const transactionAccRouter = express.Router()

transactionAccRouter.get('/list', transactionAccController.getAllTransactionAccounts)
transactionAccRouter.get('/id/:id', transactionAccController.getTransactionAccountById as Application)
transactionAccRouter.post('/add', transactionAccController.createTransactionAccount as Application)
transactionAccRouter.put('/update/:id', transactionAccController.updateTransaction as Application)
