import express from 'express';
import { FindFriendController } from './findFriendController';

const findFriendController = new FindFriendController()
export const findFriendRouter = express.Router();

findFriendRouter.post('/add', findFriendController.createFindFriendRequest as any)
findFriendRouter.patch('/accept/:request_id', findFriendController.acceptFriendRequest as any)
findFriendRouter.patch('/reject/:request_id', findFriendController.rejectFriendRequest as any)