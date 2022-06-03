import express, { Application } from 'express';
import { authMiddleware } from '../helper/authMiddleware';
import { FindFriendController } from './findFriendController';
import { createNewFriendRequestValidation } from './validation';

const findFriendController = new FindFriendController()
export const findFriendRouter = express.Router();

findFriendRouter.get('/friends', authMiddleware, findFriendController.friends as Application);
findFriendRouter.get('/friend-requests', authMiddleware, findFriendController.friendRequests as Application);
findFriendRouter.get('/received-friend-requests', authMiddleware, findFriendController.receivedFriendRequests as Application);

findFriendRouter.post(
  '/request/send',
  authMiddleware,
  createNewFriendRequestValidation,
  findFriendController.createFindFriendRequest as Application
);

findFriendRouter.patch('/request/accept/:request_id', authMiddleware, findFriendController.acceptFriendRequest as Application)
findFriendRouter.patch('/request/reject/:request_id', authMiddleware, findFriendController.rejectFriendRequest as Application)