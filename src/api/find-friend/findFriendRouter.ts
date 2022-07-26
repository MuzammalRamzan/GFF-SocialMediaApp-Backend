import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { FindFriendController } from './findFriendController'
import { acceptOrRejectFriendRequestValidation, createNewFriendRequestValidation } from './validation'

const findFriendController = new FindFriendController()
export const findFriendRouter = express.Router()

findFriendRouter.get('/search', authMiddleware, findFriendController.findFriend as Application)
findFriendRouter.get('/friends', authMiddleware, findFriendController.friends as Application)
findFriendRouter.get('/friends/:user_id', authMiddleware, findFriendController.getFriendByUserId as Application)
findFriendRouter.get('/friend-requests', authMiddleware, findFriendController.friendRequests as Application)
findFriendRouter.get(
	'/received-friend-requests',
	authMiddleware,
	findFriendController.receivedFriendRequests as Application
)

findFriendRouter.post(
	'/request/send',
	authMiddleware,
	createNewFriendRequestValidation,
	findFriendController.createFindFriendRequest as Application
)

findFriendRouter.put(
	'/request/accept',
	authMiddleware,
	acceptOrRejectFriendRequestValidation,
	findFriendController.acceptFriendRequest as Application
)
findFriendRouter.put(
	'/request/reject',
	authMiddleware,
	acceptOrRejectFriendRequestValidation,
	findFriendController.rejectFriendRequest as Application
)
findFriendRouter.delete(
	'/unfriend',
	authMiddleware,
	acceptOrRejectFriendRequestValidation,
	findFriendController.unfriend as Application
)
findFriendRouter.get('/request/:id', authMiddleware, findFriendController.getFriendRequestById as Application)

findFriendRouter.post('/block', authMiddleware, findFriendController.blockFriend as Application)
findFriendRouter.post('/unblock', authMiddleware, findFriendController.unblockFriend as Application)
findFriendRouter.get('/blocked-users', authMiddleware, findFriendController.getBlockedFriends as Application)
