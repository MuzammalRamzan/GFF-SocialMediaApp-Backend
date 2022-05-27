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

  friendRequests = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number;
      const friendRequests = await this.findFriendService.getFriendRequestsBySenderId(userId)
      res.status(200).send(friendRequests)
    } catch (err) {
      throw err
    }
  }

  receivedFriendRequests = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number;
      const receivedFriendRequests = await this.findFriendService.getFriendRequestsByReceiverId(userId)
      res.status(200).send(receivedFriendRequests)
    } catch (err) {
      throw err
    }
  }

  createFindFriendRequest = async (req: createFindFriendRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length) {
        return res.status(400).json({ errors: errors, message: 'Validation error', status: 400 });
      }

      const loggedInUserId = req?.user?.id as number;

      const request = await this.findFriendService.findBySenderIdAndReceiverId(loggedInUserId, req.body.receiver_id);
      if (request) {
        return res.status(400).send({
          message: 'Request already exists, you cannot send request twice!',
          status: 400
        });
      }

      const findFriendRequest = await this.findFriendService.add(loggedInUserId, req.body.receiver_id)
      return res.send(findFriendRequest)
    } catch (err) {
      console.log(err);
      throw err
    }
  }

  acceptFriendRequest = async (req: acceptRejectFriendRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number;
      const id = +req.params.request_id;
      const acceptFriendRequest = await this.findFriendService.approve(id, userId)
      return res.send(acceptFriendRequest)
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ message: err.message || 'Internal server error', status: 500 });
    }
  }

  rejectFriendRequest = async (req: acceptRejectFriendRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number;
      const id = +req.params.request_id;
      const rejectFriendRequest = await this.findFriendService.reject(id, userId)

      return res.send(rejectFriendRequest)
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ message: err.message || 'Internal server error', status: 500 })
    }
  }

  friends = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id as number;
      const friends = await this.findFriendService.friends(userId)
      return res.send(friends)
    } catch (err) {
      throw err
    }
  }
}
