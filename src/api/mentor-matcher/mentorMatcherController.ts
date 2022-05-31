import { Response, NextFunction, Request } from 'express';
import { IAuthenticatedRequest } from '../helper/authMiddleware';
import { MentorMatcherAuthRequest } from './interface';
import { MentorMatcherService } from './mentorMatcherService';

export class MentorMatcherController {
  private readonly mentorMatcherService: MentorMatcherService

  constructor() {
    this.mentorMatcherService = new MentorMatcherService()
  }

  public findMentors = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id || 0 as number;
      const searchTerm = req.query.searchTerm as string;

      const result = await this.mentorMatcherService.findMentors(userId, searchTerm);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public myMentors = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id || 0 as number;

      const result = await this.mentorMatcherService.myMentors(userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public sendMentorRequest = async (req: MentorMatcherAuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id || 0 as number;
      const mentor_id = Number(req.query.mentor_id || 0);

      if (mentor_id === userId) {
        return res.status(400).json({
          message: 'You cannot send request to yourself'
        });
      }

      const is_exist = await this.mentorMatcherService.isExist(userId, mentor_id);
      if (is_exist) {
        return res.status(200).json({
          message: 'Mentor request already exist',
          status: 201,
        });
      }

      await this.mentorMatcherService.sendMentorRequest(userId, mentor_id);

      return res.status(200).json({
        message: 'Mentor request sent successfully!',
        status: 200
      });
    } catch (error) {
      next(error);
    }
  }

  public acceptMentorRequest = async (req: MentorMatcherAuthRequest, res: Response, next: NextFunction) => {
    try {
      // check is the request from mentor ot not

      const userId = req?.user?.id || 0 as number;
      const mentor_id = Number(req.query.mentor_id || 0);
      const request_id = Number(req.query.request_id || 0);

      const is_approved = await this.mentorMatcherService.acceptMentorRequest(request_id, userId, mentor_id);
      if (!is_approved) {
        return res.status(400).json({
          message: 'Mentor request not found or already approved/rejected!',
          status: 400
        });
      }

      return res.status(200).json({
        message: 'Mentor request accepted successfully!',
        status: 200
      });
    } catch (error) {
      next(error);
    }
  }

  public rejectMentorRequest = async (req: MentorMatcherAuthRequest, res: Response, next: NextFunction) => {
    try {
      // check is the request from mentor ot not

      const userId = req?.user?.id || 0 as number;
      const mentor_id = Number(req.query.mentor_id || 0);
      const request_id = Number(req.query.request_id || 0);

      const is_approved = await this.mentorMatcherService.rejectMentorRequest(request_id, userId, mentor_id);
      if (!is_approved) {
        return res.status(400).json({
          message: 'Mentor request not found or already approved/rejected!',
          status: 400
        });
      }

      return res.status(200).json({
        message: 'Mentor request rejected successfully!',
        status: 200
      });
    } catch (error) {
      next(error);
    }
  }

  public getMentorRequests = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id || 0 as number;

      const result = await this.mentorMatcherService.getMentorRequests(userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
