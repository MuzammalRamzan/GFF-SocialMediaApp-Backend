import express from 'express';
import { authMiddleware } from '../helper/authMiddleware';
import { FindFriendController } from './findFriendController';
import { createNewFriendRequestValidation } from './validation';

const findFriendController = new FindFriendController()
export const findFriendRouter = express.Router();

findFriendRouter.get('/friends', authMiddleware, findFriendController.friends as any);
findFriendRouter.get('/friend-requests', authMiddleware, findFriendController.friendRequests as any);
findFriendRouter.get('/received-friend-requests', authMiddleware, findFriendController.receivedFriendRequests as any);

findFriendRouter.post(
  '/request/send',
  authMiddleware,
  createNewFriendRequestValidation,
  findFriendController.createFindFriendRequest as any
);

findFriendRouter.patch('/request/accept/:request_id', authMiddleware, findFriendController.acceptFriendRequest as any)
findFriendRouter.patch('/request/reject/:request_id', authMiddleware, findFriendController.rejectFriendRequest as any)