import express from 'express';
import { FindFriendController } from './findFirendController';

const findFriendController = new FindFriendController()
export const findFriendRouter = express.Router();

findFriendRouter.post('/add', findFriendController.createFindFriendRequest as any)
// findFriendRouter.get('/', transactionCategotryController.getAllTransactionCategories)