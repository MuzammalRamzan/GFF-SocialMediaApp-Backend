import express from 'express'
import { TransactionAccController } from './transactionAccController'

const transactionAccController = new TransactionAccController()
export const transactionAccRouter = express.Router()

transactionAccRouter.get('/list', transactionAccController.getAllTransactionAccounts)
transactionAccRouter.get('/id/:id', transactionAccController.getTransactionAccountById as any)
transactionAccRouter.post('/add', transactionAccController.createTransactionAccount as any)
transactionAccRouter.put('/update/:id', transactionAccController.updateTransaction as any)
