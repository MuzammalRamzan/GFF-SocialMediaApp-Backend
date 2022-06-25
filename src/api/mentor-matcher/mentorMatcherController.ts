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
      return res.status(200).json({
        data: {
          mentors
        },
        message: "Mentors found successfully",
        code: 200
      });
    } catch (error) {
      next(error);
    }
  }

  public myMentors = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id || 0 as number;

      const mentors = await this.mentorMatcherService.myMentors(userId);
      return res.status(200).json({
        data: {
          mentors
        },
        message: "Mentors found successfully",
        code: 200
      });
    } catch (error) {
      next(error);
    }
  }

  public myMentees = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id || 0 as number;

      const mentees = await this.mentorMatcherService.myMentees(userId);
      return res.status(200).json({
        data: {
          mentees
        },
        message: "Mentees found successfully",
        code: 200
      });
    } catch (error) {
      next(error);
    }
  }

  public sendMentorRequest = async (req: MentorMatcherAuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length) {
        return res.status(400).json({ errors: errors, message: 'Validation error', code: 400 });
      }

      const userId = req?.user?.id || 0 as number;
      const mentor_id = Number(req.body.mentor_id || 0);
      const message = req.body.message

      const isMentorExists = MentorInformationService.isMentorExists(mentor_id);

      if (!isMentorExists) {
        return res.status(404).json({ message: 'Mentor does not exist', code: 404 });
      }

      if (mentor_id === userId) {
        return res.status(400).json({
          message: 'You cannot send request to yourself',
          code: 400
        });
      }

      const is_exist = await MentorMatcherService.isExist(userId, mentor_id) as any;
      if (is_exist) {
        return res.status(200).json({
          message: 'Mentor request already exist',
          code: 200
        });
      }

      await this.mentorMatcherService.sendMentorRequest(userId, mentor_id, message);

      return res.status(200).json({
        message: 'Mentor request sent successfully!',
        code: 200
      });
    } catch (error) {
      next(error);
    }
  }

  public acceptMentorRequest = async (req: MentorMatcherAuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length) {
        return res.status(400).json({ errors: errors, message: 'Validation error', code: 400 });
      }

      // check is the request from mentor ot not

      const userId = req?.user?.id || 0 as number;
      const request_id = Number(req.body.request_id || 0);

      if (!request_id) {
        return res.status(400).json({
          message: 'Invalid request',
          code: 400
        });
      }

      const is_approved = await this.mentorMatcherService.acceptMentorRequest(request_id, userId);
      if (!is_approved) {
        return res.status(400).json({
          message: 'Mentor request not found or already approved/rejected!',
          code: 400
        });
      }

      return res.status(200).json({
        message: 'Mentor request accepted successfully!',
        code: 200
      });
    } catch (error) {
      next(error);
    }
  }

  public rejectMentorRequest = async (req: MentorMatcherAuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length) {
        return res.status(400).json({ errors: errors, message: 'Validation error', code: 400 });
      }
      // check is the request from mentor ot not

      const userId = req?.user?.id || 0 as number;
      const request_id = Number(req.body.request_id || 0);

      if (!request_id) {
        return res.status(400).json({
          message: 'Invalid request',
          code: 400
        })
      }

      const is_approved = await this.mentorMatcherService.rejectMentorRequest(request_id, userId);
      if (!is_approved) {
        return res.status(400).json({
          message: 'Mentor request not found or already approved/rejected!',
          code: 400
        });
      }

      return res.status(200).json({
        message: 'Mentor request rejected successfully!',
        code: 200
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
        data: {
          mentors
        },
        message: "Mentor requests found successfully",
        code: 200
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
        data: {
          mentors
        },
        message: "Mentor requests found successfully",
        code: 200
      });
    } catch (error) {
      next(error);
    }
  }

  public removeMentorFromFavorite = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length) {
        return res.status(400).json({ errors: errors, message: 'Validation error', code: 400 });
      }

      const userId = req?.user?.id || 0 as number;
      const mentor_id = Number(req.body.mentor_id || 0);

      const isMentorExists = MentorInformationService.isMentorExists(mentor_id);

      if (!isMentorExists) {
        return res.status(404).json({ message: 'Mentor does not exist', code: 404 });
      }

      if (mentor_id === userId) {
        return res.status(400).json({
          message: 'You cannot remove yourself from your favorite list!',
          code: 400
        });
      }

      const is_exist = await this.mentorMatcherService.isFavoriteExist(userId, mentor_id);
      if (!is_exist) {
        return res.status(400).json({
          message: 'Mentor is not in your favorite list!',
          code: 400
        });
      }

      const result = await this.mentorMatcherService.removeMentorFromFavorite(userId, mentor_id);
      return res.status(200).json({
        message: result ? "Mentor removed from favorite list successfully!" : "Mentor not found!",
        code: 200
      });
    } catch (error) {
      next(error);
    }
  }

  public addMentorToFavorite = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length) {
        return res.status(400).json({ errors: errors, message: 'Validation error', code: 400 });
      }

      const userId = req?.user?.id || 0 as number;
      const mentor_id = Number(req.body.mentor_id || 0);

      const isMentorExists = MentorInformationService.isMentorExists(mentor_id);

      if (!isMentorExists) {
        return res.status(404).json({ message: 'Mentor does not exist', code: 404 });
      }

      if (mentor_id === userId) {
        return res.status(400).json({
          message: 'You cannot add yourself to your favorite list!',
          code: 400
        });
      }

      const is_exist = await this.mentorMatcherService.isFavoriteExist(userId, mentor_id);
      if (is_exist) {
        return res.status(400).json({
          message: 'Mentor is already in your favorite list!',
          code: 400
        });
      }

      const result = await this.mentorMatcherService.addMentorToFavorite(userId, mentor_id);
      return res.status(200).json({
        message: result ? "Mentor added to favorite list successfully!" : "Error occurred while adding into favorite!",
        code: 200
      });
    } catch (error) {
      next(error);
    }
  }

  public signContract = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length) {
        return res.status(400).json({ errors: errors, message: 'Validation error', code: 400 });
      }

      const userId = req?.user?.id || 0 as number;
      const request_id = Number(req.body.request_id || 0);

      const is_exist = await this.mentorMatcherService.findById(request_id, userId);
      if (!is_exist) {
        return res.status(401).json({
          message: 'You are not authorized to access this resource!',
          code: 401
        });
      }

      const result = await this.mentorMatcherService.signContract(userId, request_id);
      return res.status(200).json({
        message: result ? "Contract signed successfully!" : "The contract has been signed already or the mentor request is not accepted!",
        code: 200
      });
    } catch (error) {
      next(error);
    }
  }
}
