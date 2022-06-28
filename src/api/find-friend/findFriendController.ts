import { Response, NextFunction, Request } from 'express'
import { validationResult } from 'express-validator'
import { IAuthenticatedRequest } from '../helper/authMiddleware'
import { UserService } from '../user/userService'
import { FindFriendService } from './findFriendService'
import { acceptRejectFriendRequest, createFindFriendRequest } from './interface'

export class FindFriendController {
	private readonly findFriendService: FindFriendService

	constructor() {
		this.findFriendService = new FindFriendService()
	}

	findFriend = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const searchTerm = req.query.search as string
			const userId = req?.user?.id as number

			const friend = await this.findFriendService.findFriend(searchTerm, userId)
			return res.status(200).json({
				data: {
					friend
				},
				message: 'Friend found',
				code: 200
			})
		} catch (error) {
			next(error)
		}
	}

  friendRequests = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number;
      const friendRequests = await this.findFriendService.getFriendRequestsBySenderId(userId)
      res.status(200).send({
        data: {
          friend: friendRequests
        },
        message: 'Friend requests found',
        code: 200
      })
    } catch (err) {
      next(err);
    }
  }

  receivedFriendRequests = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number;
      const receivedFriendRequests = await this.findFriendService.getFriendRequestsByReceiverId(userId)
      res.status(200).send({
        data: {
          requests: receivedFriendRequests
        },
        message: 'Received friend requests found',
        code: 200
      })
    } catch (err) {
      next(err);
    }
  }

	createFindFriendRequest = async (req: createFindFriendRequest, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req).array({ onlyFirstError: true })
			if (errors.length) {
				return res.status(400).json({ errors: errors, message: 'Validation error', code: 400 })
			}

			const loggedInUserId = req?.user?.id as number
			const user_id = req.body.user_id as number

			const isUserExists = await UserService.isExists(user_id)

			if (!isUserExists) {
				return res.status(400).json({ message: 'User not found', code: 400 })
			}

			const request = await this.findFriendService.findBySenderIdAndReceiverId(loggedInUserId, user_id)
			if (request) {
				return res.status(400).send({
					message: 'Request already exists, you cannot send request twice!',
					code: 400
				})
			}

      const findFriendRequest = await this.findFriendService.add(loggedInUserId, user_id)
      return res.status(200).send({
        data: {
          requests: findFriendRequest
        },
        message: 'Request created successfully',
        code: 200
      })
    } catch (err) {
      next(err);
    }
  }

  acceptFriendRequest = async (req: acceptRejectFriendRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number;
      const id = +req.body.request_id;
      const acceptFriendRequest = await this.findFriendService.approve(id, userId)
      return res.status(200).send({
        data: {
          requests: acceptFriendRequest
        },
        message: 'Request accepted successfully',
        code: 200
      })
    } catch (err: any) {
      next(err);

    }
  }

	rejectFriendRequest = async (req: acceptRejectFriendRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req?.user?.id as number
			const id = +req.body.request_id
			const rejectFriendRequest = await this.findFriendService.reject(id, userId)

      return res.status(200).send({
        data: {
          requests: rejectFriendRequest
        },
        message: 'Request rejected successfully',
        code: 200
      })
    } catch (err: any) {
      next(err);
    }
  }

  friends = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number;
      const friends = await this.findFriendService.friends(userId)
      return res.status(200).send({
        data: {
          friends
        },
        message: 'Friends found',
        code: 200
      })
    } catch (err) {
      next(err);
    }
  }

  getFriendRequestById = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = Number(req?.params?.id);
      const friendRequest = await this.findFriendService.getFriendRequestById(id)
      return res.status(200).send({
        data: {
          friendRequest
        },
        message: 'Friend request found',
        code: 200
      })
    } catch (err) {
      next(err);
    }
  }

	blockFriend = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req?.user?.id as number
			const id = req.body.user_id
			const reason = req.body.reason || ''

			const isExists = await UserService.isExists(id)
			if (!isExists) {
				return res.status(404).json({ message: 'User not found', code: 404 })
			}

      const blockFriend = await this.findFriendService.blockFriend(userId, id, reason)
      return res.status(200).send({
        data: {
          blockFriend
        },
        message: 'Friend blocked successfully',
        code: 200
      })
    } catch (err) {
      next(err);
    }
  }

	unblockFriend = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req?.user?.id as number
			const id = req.body.user_id

			const isExists = await UserService.isExists(id)
			if (!isExists) {
				return res.status(404).json({ message: 'User not found', code: 404 })
			}

      const unblockFriend = await this.findFriendService.unblockFriend(userId, id)
      return res.status(200).send({
        data: {
          unblockFriend
        },
        message: 'Friend unblocked successfully',
        code: 200
      })
    } catch (err) {
      next(err);
    }
  }

  getBlockedFriends = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number;
      const blockedFriends = await this.findFriendService.getBlockedFriends(userId)
      return res.status(200).send({
        data: {
          blockedFriends
        },
        message: 'Blocked friends found',
        code: 200
      })
    } catch (err) {
      next(err);
    }
  }

	getFriendByUserId = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const loggedInUserId = req?.user?.id as number
			const userId = +req.params.user_id

			const isExists = await UserService.isExists(userId)
			if (!isExists) {
				return res.status(404).json({ message: 'User not found', code: 404 })
			}

      const friend = await this.findFriendService.getFriendByUserId(loggedInUserId, userId)
      return res.status(200).send({
        data: {
          friend
        },
        message: 'Friend found',
        code: 200
      })
    } catch (err) {
      next(err);
    }
  }
}
