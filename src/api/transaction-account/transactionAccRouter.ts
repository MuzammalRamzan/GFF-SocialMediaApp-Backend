import express from 'express';
import { TransactionAccController } from './transactionAccController';

const transactionAccController = new TransactionAccController()
export const transactionAccRouter = express.Router();

transactionAccRouter.get('/list', transactionAccController.getAllTransactionAccounts)
transactionAccRouter.get('/fetch', transactionAccController.getAllTransactionAccounts)
transactionAccRouter.post('/add', transactionAccController.createTransactionAccount)