import { Request, Response, NextFunction } from 'express';
import { FindFriendService } from './findFriendService';
import {
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
}
