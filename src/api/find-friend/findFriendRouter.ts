import express, { Application } from 'express';
import { authMiddleware } from '../helper/authMiddleware';
import { FindFriendController } from './findFriendController';
import { acceptOrRejectFriendRequestValidation, createNewFriendRequestValidation } from './validation';

const findFriendController = new FindFriendController()
export const findFriendRouter = express.Router();

findFriendRouter.get('/search', authMiddleware, findFriendController.findFriend as Application);
findFriendRouter.get('/friends', authMiddleware, findFriendController.friends as Application);
findFriendRouter.get('/friend-requests', authMiddleware, findFriendController.friendRequests as Application);
findFriendRouter.get('/received-friend-requests', authMiddleware, findFriendController.receivedFriendRequests as Application);

findFriendRouter.post(
  '/request/send',
  authMiddleware,
  createNewFriendRequestValidation,
  findFriendController.createFindFriendRequest as Application
);

findFriendRouter.put('/request/accept', authMiddleware, acceptOrRejectFriendRequestValidation, findFriendController.acceptFriendRequest as Application)
findFriendRouter.put('/request/reject', authMiddleware, acceptOrRejectFriendRequestValidation, findFriendController.rejectFriendRequest as Application)