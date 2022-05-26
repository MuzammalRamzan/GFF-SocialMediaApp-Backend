import express from 'express';
import { FindFriendController } from './findFriendController';

const findFriendController = new FindFriendController()
export const findFriendRouter = express.Router();

findFriendRouter.post('/add', findFriendController.createFindFriendRequest as any)
findFriendRouter.post('/accept', findFriendController.acceptFriendRequest as any)
findFriendRouter.post('/reject', findFriendController.rejectFriendRequest as any)