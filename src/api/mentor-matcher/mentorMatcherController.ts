import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { IAuthenticatedRequest } from '../helper/authMiddleware';
import { MentorInformationService } from '../mentor-information/mentorInformationService';
import { ISarchTermParams, MentorMatcherAuthRequest } from './interface';
import { MentorMatcherService } from './mentorMatcherService';

export class MentorMatcherController {
  private readonly mentorMatcherService: MentorMatcherService

  constructor() {
    this.mentorMatcherService = new MentorMatcherService()
  }

  public findMentors = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id || 0 as number;

      const mentors = await this.mentorMatcherService.findMentors(userId, req.query as ISarchTermParams);
      return res.status(200).json({ mentors });
    } catch (error) {
      next(error);
    }
  }

  public myMentors = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id || 0 as number;

      const mentors = await this.mentorMatcherService.myMentors(userId);
      return res.status(200).json({ mentors });
    } catch (error) {
      next(error);
    }
  }

  public myMentees = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id || 0 as number;

      const mentees = await this.mentorMatcherService.myMentees(userId);
      return res.status(200).json({ mentees });
    } catch (error) {
      next(error);
    }
  }

  public sendMentorRequest = async (req: MentorMatcherAuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length) {
        return res.status(400).json({ errors: errors, message: 'Validation error' });
      }

      const userId = req?.user?.id || 0 as number;
      const mentor_id = Number(req.body.mentor_id || 0);
      const message = req.body.message

      const isMentorExists = MentorInformationService.isMentorExists(mentor_id);

      if (!isMentorExists) {
        return res.status(400).json({ message: 'Mentor does not exist' });
      }

      if (mentor_id === userId) {
        return res.status(400).json({
          message: 'You cannot send request to yourself'
        });
      }

      const is_exist = await MentorMatcherService.isExist(userId, mentor_id) as any;
      if (is_exist) {
        return res.status(200).json({
          message: 'Mentor request already exist',
        });
      }

      await this.mentorMatcherService.sendMentorRequest(userId, mentor_id, message);

      return res.status(200).json({
        message: 'Mentor request sent successfully!',
      });
    } catch (error) {
      next(error);
    }
  }

  public acceptMentorRequest = async (req: MentorMatcherAuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length) {
        return res.status(400).json({ errors: errors, message: 'Validation error', });
      }

      // check is the request from mentor ot not

      const userId = req?.user?.id || 0 as number;
      const request_id = Number(req.body.request_id || 0);

      if(!request_id) {
        return res.status(400).json({
          message: 'Invalid request'
        });
      }

      const is_approved = await this.mentorMatcherService.acceptMentorRequest(request_id, userId);
      if (!is_approved) {
        return res.status(400).json({
          message: 'Mentor request not found or already approved/rejected!',
        });
      }

      return res.status(200).json({
        message: 'Mentor request accepted successfully!',
      });
    } catch (error) {
      next(error);
    }
  }

  public rejectMentorRequest = async (req: MentorMatcherAuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length) {
        return res.status(400).json({ errors: errors, message: 'Validation error' });
      }
      // check is the request from mentor ot not

      const userId = req?.user?.id || 0 as number;
      const request_id = Number(req.body.request_id || 0);

      if(!request_id) {
        return res.status(400).json({
          message: 'Invalid request'
        })
      }

      const is_approved = await this.mentorMatcherService.rejectMentorRequest(request_id, userId);
      if (!is_approved) {
        return res.status(400).json({
          message: 'Mentor request not found or already approved/rejected!',
        });
      }

      return res.status(200).json({
        message: 'Mentor request rejected successfully!',
      });
    } catch (error) {
      next(error);
    }
  }

  public getMentorRequests = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id || 0 as number;

      const mentors = await this.mentorMatcherService.getMentorRequests(userId);
      return res.status(200).json({
        mentors
      });
    } catch (error) {
      next(error);
    }
  }

  public getMentorRequestsByMenteeId = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id || 0 as number;

      const mentors = await this.mentorMatcherService.getMentorRequestsByMenteeId(userId);
      return res.status(200).json({
        mentors
      });
    } catch (error) {
      next(error);
    }
  }

  public removeMentorFromFavorite = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length) {
        return res.status(400).json({ errors: errors, message: 'Validation error' });
      }

      const userId = req?.user?.id || 0 as number;
      const mentor_id = Number(req.body.mentor_id || 0);

      const isMentorExists = MentorInformationService.isMentorExists(mentor_id);

      if (!isMentorExists) {
        return res.status(400).json({ message: 'Mentor does not exist' });
      }

      if (mentor_id === userId) {
        return res.status(400).json({
          message: 'You cannot remove yourself from your favorite list!',
        });
      }

      const is_exist = await this.mentorMatcherService.isFavoriteExist(userId, mentor_id);
      if (!is_exist) {
        return res.status(400).json({
          message: 'Mentor is not in your favorite list!',
        });
      }

      const result = await this.mentorMatcherService.removeMentorFromFavorite(userId, mentor_id);
      return res.status(200).json({
        data: result ? "Mentor removed from favorite list successfully!" : "Mentor not found!"
      });
    } catch (error) {
      next(error);
    }
  }

  public addMentorToFavorite = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length) {
        return res.status(400).json({ errors: errors, message: 'Validation error' });
      }

      const userId = req?.user?.id || 0 as number;
      const mentor_id = Number(req.body.mentor_id || 0);

      const isMentorExists = MentorInformationService.isMentorExists(mentor_id);

      if (!isMentorExists) {
        return res.status(400).json({ message: 'Mentor does not exist' });
      }

      if (mentor_id === userId) {
        return res.status(400).json({
          message: 'You cannot add yourself to your favorite list!',
        });
      }

      const is_exist = await this.mentorMatcherService.isFavoriteExist(userId, mentor_id);
      if (is_exist) {
        return res.status(400).json({
          message: 'Mentor is already in your favorite list!',
        });
      }

      const result = await this.mentorMatcherService.addMentorToFavorite(userId, mentor_id);
      return res.status(200).json({
        data: result ? "Mentor added to favorite list successfully!" : "Error occurred while adding into favorite!"
      });
    } catch (error) {
      next(error);
    }
  }

  public signContract = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length) {
        return res.status(400).json({ errors: errors, message: 'Validation error' });
      }

      const userId = req?.user?.id || 0 as number;
      const request_id = Number(req.body.request_id || 0);

      const is_exist = await this.mentorMatcherService.findById(request_id, userId);
      if (!is_exist) {
        return res.status(401).json({
          message: 'You are not authorized to access this resource!',
        });
      }

      const result = await this.mentorMatcherService.signContract(userId, request_id);
      return res.status(200).json({
        data: result ? "Contract signed successfully!" : "The contract has been signed already or the mentor request is not accepted!"
      });
    } catch (error) {
      next(error);
    }
  }
}
