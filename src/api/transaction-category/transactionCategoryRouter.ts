import express, { Application } from 'express';
import { authMiddleware } from '../helper/authMiddleware';
import { TransactionCategotryController } from './transactionCategoryController';

const transactionCategotryController = new TransactionCategotryController()
export const transactionCategoryRouter = express.Router();

transactionCategoryRouter.post('/add', authMiddleware, transactionCategotryController.createTransactionCategory as Application)
transactionCategoryRouter.get('/', authMiddleware, transactionCategotryController.getAllTransactionCategories )
transactionCategoryRouter.get('/user_id', authMiddleware, transactionCategotryController.getTransactionCategoriesByUserId as Application)
transactionCategoryRouter.put('/update/:id', authMiddleware, transactionCategotryController.updateTransactionCategoryById as Application)
transactionCategoryRouter.delete('/delete/:id', authMiddleware, transactionCategotryController.deleteTransactionCategory as Application)
