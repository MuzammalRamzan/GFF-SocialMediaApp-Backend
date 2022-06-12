import { Response, NextFunction, Request } from 'express';
import { validationResult } from 'express-validator';
import { IAuthenticatedRequest } from '../helper/authMiddleware';
import { FindFriendService } from './findFriendService';
import {
  acceptRejectFriendRequest,
  createFindFriendRequest,
} from './interface';

export class FindFriendController {
  private readonly findFriendService: FindFriendService

  constructor() {
    this.findFriendService = new FindFriendService()
  }

  findFriend = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const searchTerm = req.query.search as string;
      const userId = req?.user?.id as number;

      const friend = await this.findFriendService.findFriend(searchTerm, userId);
      return res.status(200).json({ friend });
    } catch (error) {
      next(error);
    }
  }

  friendRequests = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number;
      const friendRequests = await this.findFriendService.getFriendRequestsBySenderId(userId)
      res.status(200).send({ friend: friendRequests })
    } catch (err) {
      throw err
    }
  }

  receivedFriendRequests = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number;
      const receivedFriendRequests = await this.findFriendService.getFriendRequestsByReceiverId(userId)
      res.status(200).send({ requests: receivedFriendRequests })
    } catch (err) {
      throw err
    }
  }

  createFindFriendRequest = async (req: createFindFriendRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length) {
        return res.status(400).json({ errors: errors, message: 'Validation error' });
      }

      const loggedInUserId = req?.user?.id as number;

      const request = await this.findFriendService.findBySenderIdAndReceiverId(loggedInUserId, req.body.user_id);
      if (request) {
        return res.status(400).send({
          message: 'Request already exists, you cannot send request twice!'
        });
      }

      const findFriendRequest = await this.findFriendService.add(loggedInUserId, req.body.user_id)
      return res.status(200).send({ requests: findFriendRequest })
    } catch (err) {
      console.log(err);
      throw err
    }
  }

  acceptFriendRequest = async (req: acceptRejectFriendRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number;
      const id = +req.body.request_id;
      const acceptFriendRequest = await this.findFriendService.approve(id, userId)
      return res.status(200).send({ requests: acceptFriendRequest })
    } catch (err: any) {
      console.log(err);
      throw new Error(err.message || 'Internal server error')
    }
  }

  rejectFriendRequest = async (req: acceptRejectFriendRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number;
      const id = +req.body.request_id;
      const rejectFriendRequest = await this.findFriendService.reject(id, userId)

      return res.status(200).send({ requests: rejectFriendRequest })
    } catch (err: any) {
      console.log(err);
      throw new Error(err.message || 'Internal server error')
    }
  }

  friends = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number;
      const friends = await this.findFriendService.friends(userId)
      return res.status(200).send({ friends })
    } catch (err) {
      throw err
    }
  }
}
