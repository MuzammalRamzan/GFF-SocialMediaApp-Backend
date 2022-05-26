import express from 'express';
import { TransactionCategotryController } from './transactionCategoryController';

const transactionCategotryController = new TransactionCategotryController()
export const transactionCategoryRouter = express.Router();

transactionCategoryRouter.post('/add', transactionCategotryController.createTransactionCategory as any)
transactionCategoryRouter.get('/', transactionCategotryController.getAllTransactionCategories)
transactionCategoryRouter.get('/:user_id', transactionCategotryController.getTransactionCategoriesByUserId as any)
transactionCategoryRouter.put('/update/:id', transactionCategotryController.updateTransactionCategoryById as any)
transactionCategoryRouter.delete('/delete/:id', transactionCategotryController.deleteTransactionCategory as any)
