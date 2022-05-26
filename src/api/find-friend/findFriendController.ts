import { Response, NextFunction } from 'express';
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

  createFindFriendRequest = async (req: createFindFriendRequest, res: Response, next: NextFunction) => {
    try {
      const findFriendRequest = await this.findFriendService.add(req.body.sender_id, req.body.receiver_id)
      return res.send(findFriendRequest)
    } catch (err) {
      console.log(err);
      throw err
    }
  }
  acceptFriendRequest = async (req: acceptRejectFriendRequest, res: Response, next: NextFunction) => {
    try {
      const id = +req.params.request_id;
      const acceptFriendRequest = await this.findFriendService.approve(id)
      return res.send(acceptFriendRequest)
    } catch (err) {
      console.log(err);
      throw err
    }
  }
  rejectFriendRequest = async (req: acceptRejectFriendRequest, res: Response, next: NextFunction) => {
    try {
      const id = +req.params.request_id;
      const rejectFriendRequest = await this.findFriendService.reject(id)
      return res.send(rejectFriendRequest)
    } catch (err) {
      console.log(err);
      throw err
    }
  }
}
