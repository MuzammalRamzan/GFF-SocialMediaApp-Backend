import { Response, NextFunction, Request } from 'express'
import { validationResult } from 'express-validator'
import { RoomService } from '../chat/room/room.service'
import { IAuthenticatedRequest } from '../helper/authMiddleware'
import { GffError } from '../helper/errorHandler'
import { UserService } from '../user/userService'
import { FindFriendService } from './findFriendService'
import { acceptRejectFriendRequest, createFindFriendRequest } from './interface'
import { MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api'
import { UserFCMTokenService } from '../user-fcm-token/userFCMTokenService'
import { FirebaseService } from '../../helper/firebaseService'

export class FindFriendController {
  private readonly findFriendService: FindFriendService
  private readonly roomService: RoomService
  private readonly userService: UserService
  private readonly firebaseService: FirebaseService
  private readonly fcmService: UserFCMTokenService

  constructor () {
    this.roomService = new RoomService()
    this.findFriendService = new FindFriendService()
    this.userService = new UserService()
    this.firebaseService = new FirebaseService()
    this.fcmService = new UserFCMTokenService()
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
      const userId = req?.user?.id as number
      const friendRequests = await this.findFriendService.getFriendRequestsBySenderId(userId)
      res.status(200).send({
        data: {
          friend: friendRequests
        },
        message: 'Friend requests found',
        code: 200
      })
    } catch (err) {
      next(err)
    }
  }

  receivedFriendRequests = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number
      const receivedFriendRequests = await this.findFriendService.getFriendRequestsByReceiverId(userId)
      res.status(200).send({
        data: {
          requests: receivedFriendRequests
        },
        message: 'Received friend requests found',
        code: 200
      })
    } catch (err) {
      next(err)
    }
  }

  createFindFriendRequest = async (req: createFindFriendRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true })
      if (errors.length) {
        return res.status(400).json({
          errors: errors,
          message: 'Validation error',
          code: 400
        })
      }

      const loggedInUserId = req?.user?.id as number
      const user_id = req.body.user_id as number

      const isUserExists = await UserService.isExists(user_id)

      if (!isUserExists) {
        return res.status(400).json({
          message: 'User not found',
          code: 400
        })
      }

      const isBlocked = await this.findFriendService.isBlocked(loggedInUserId, user_id)
      if (isBlocked) {
        return res.status(400).json({
          message:
            isBlocked.sender_id === loggedInUserId
              ? 'You have blocked this user, please unblock the friend and send a new request!'
              : 'You cannot send friend request to this user!',
          code: 400
        })
      }

      const isFriend = await this.findFriendService.areUsersFriend(loggedInUserId, user_id)
      if (isFriend) {
        return res
          .status(400)
          .json({
            message: 'Request already exists or accepted it, you cannot send request twice!',
            code: 400
          })
      }

      const findFriendRequest = await this.findFriendService.add(loggedInUserId, user_id)

      const fcmTokens = await this.fcmService.getUserTokens(user_id)
      const tokens = fcmTokens.map(x => x.get().token)

      // @todo title and body needs to be changed.
      await this.firebaseService.getInstance().sendMultiple({
        data: {
          loggedInUserId: loggedInUserId + '',
          user_id: user_id + ''
        },
        notification: {
          title: 'You have a Friendship request.',
          body: 'You have a Friendship request.'
        },
        tokens: tokens
      } as MulticastMessage)

      return res.status(200).send({
        data: {
          requests: findFriendRequest
        },
        message: 'Request created successfully',
        code: 200
      })
    } catch (err) {
      next(err)
    }
  }

  acceptFriendRequest = async (req: acceptRejectFriendRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number
      const id = +req.body.request_id

      const acceptFriendRequest = await this.findFriendService.approve(id, userId)

      if (acceptFriendRequest) {
        const users = [acceptFriendRequest.get('sender_id') as number, acceptFriendRequest.get('receiver_id') as number]

        const user = await this.userService.fetchById(0, acceptFriendRequest.get('sender_id') as number)

        const doesRoomExist = await this.roomService.doesRoomExist(users)
        if (!doesRoomExist) {
          await this.roomService.createRoom({
            name: `${req.user?.full_name} and ${user.getDataValue('full_name')}`,
            user_ids: users.map(id => `${id}`)
          })
        }

        const fcmTokens = await this.fcmService.getUserTokens(acceptFriendRequest.get('sender_id') as number)
        const tokens = fcmTokens.map(x => x.get().token)

        // @todo title and body needs to be changed.
        await this.firebaseService.getInstance().sendMultiple({
          data: {
            sender_id: acceptFriendRequest.get('sender_id') + ''
          },
          notification: {
            title: 'Friendship request accepted.',
            body: 'Friendship request accepted.',
          },
          tokens: tokens
        } as MulticastMessage)

      }

      return res.status(200).send({
        data: {
          requests: acceptFriendRequest
        },
        message: 'Request accepted successfully',
        code: 200
      })
    } catch (err: any) {
      next(err)
    }
  }

  rejectFriendRequest = async (req: acceptRejectFriendRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number
      const id = +req.body.request_id
      const rejectFriendRequest = await this.findFriendService.reject(id, userId)

      const fcmTokens = await this.fcmService.getUserTokens(rejectFriendRequest.get('sender_id') as number)
      const tokens = fcmTokens.map(x => x.get().token)

      // @todo title and body needs to be changed.
      await this.firebaseService.getInstance().sendMultiple({
        data: {
          sender_id: rejectFriendRequest.get('sender_id') + ''
        },
        notification: {
          title: 'Friendship request rejected.',
          body: 'Friendship request rejected.'
        },
        tokens: tokens
      } as MulticastMessage)

      return res.status(200).send({
        data: {
          requests: rejectFriendRequest
        },
        message: 'Request rejected successfully',
        code: 200
      })
    } catch (err: any) {
      next(err)
    }
  }

  friends = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number
      const friends = await this.findFriendService.friends(userId)
      return res.status(200).send({
        data: {
          friends
        },
        message: 'Friends found',
        code: 200
      })
    } catch (err) {
      next(err)
    }
  }

  getFriendRequestById = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = Number(req?.params?.id)
      const friendRequest = await this.findFriendService.getFriendRequestById(id)
      return res.status(200).send({
        data: {
          friendRequest
        },
        message: 'Friend request found',
        code: 200
      })
    } catch (err) {
      next(err)
    }
  }

  blockFriend = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number
      const id = req.body.user_id
      const reason = req.body.reason || ''

      const isExists = await UserService.isExists(id)
      if (!isExists) {
        return res.status(404).json({
          message: 'User not found',
          code: 404
        })
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
      next(err)
    }
  }

  unblockFriend = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number
      const id = req.body.user_id

      const isExists = await UserService.isExists(id)
      if (!isExists) {
        return res.status(404).json({
          message: 'User not found',
          code: 404
        })
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
      next(err)
    }
  }

  getBlockedFriends = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number
      const blockedFriends = await this.findFriendService.getBlockedFriends(userId)
      return res.status(200).send({
        data: {
          blockedFriends
        },
        message: 'Blocked friends found',
        code: 200
      })
    } catch (err) {
      next(err)
    }
  }

  getFriendByUserId = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const loggedInUserId = req?.user?.id as number
      const userId = +req.params.user_id

      const isExists = await UserService.isExists(userId)
      if (!isExists) {
        return res.status(404).json({
          message: 'User not found',
          code: 404
        })
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
      next(err)
    }
  }

  unfriend = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const request_id = +req.body.request_id
      const user_id = req.user?.id as number
      const destroyedObjects = await this.findFriendService.unfriend(request_id, user_id)

      if (!destroyedObjects) {
        const error = new GffError('Friend doesn\'t exist')
        error.errorCode = '403'
        throw error
      }

      return res.status(200).json({
        data: {},
        message: 'Removed user from your friend list.',
        code: 200
      })
    } catch (err) {
      next(err)
    }
  }
}
