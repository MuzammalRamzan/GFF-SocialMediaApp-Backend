import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
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
      return res.status(200).json({
        status: 200,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  public myMentors = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id || 0 as number;

      const result = await this.mentorMatcherService.myMentors(userId);
      return res.status(200).json({
        status: 200,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  public myMentees = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id || 0 as number;

      const result = await this.mentorMatcherService.myMentees(userId);
      return res.status(200).json({
        status: 200,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  public sendMentorRequest = async (req: MentorMatcherAuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length) {
        return res.status(400).json({ errors: errors, message: 'Validation error', status: 400 });
      }

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
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length) {
        return res.status(400).json({ errors: errors, message: 'Validation error', status: 400 });
      }

      // check is the request from mentor ot not

      const userId = req?.user?.id || 0 as number;
      const mentee_id = Number(req.query.mentee_id || 0);
      const request_id = Number(req.query.request_id || 0);

      const is_approved = await this.mentorMatcherService.acceptMentorRequest(request_id, userId, mentee_id);
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
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length) {
        return res.status(400).json({ errors: errors, message: 'Validation error', status: 400 });
      }
      // check is the request from mentor ot not

      const userId = req?.user?.id || 0 as number;
      const mentee_id = Number(req.query.mentee_id || 0);
      const request_id = Number(req.query.request_id || 0);

      const is_approved = await this.mentorMatcherService.rejectMentorRequest(request_id, userId, mentee_id);
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
      return res.status(200).json({
        status: 200,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  public getMentorRequestsByMenteeId = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id || 0 as number;

      const result = await this.mentorMatcherService.getMentorRequestsByMenteeId(userId);
      return res.status(200).json({
        status: 200,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  public removeMentorFromFavorite = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({ onlyFirstError: true });
      if (errors.length) {
        return res.status(400).json({ errors: errors, message: 'Validation error', status: 400 });
      }

      const userId = req?.user?.id || 0 as number;
      const mentor_id = Number(req.query.mentor_id || 0);

      if (mentor_id === userId) {
        return res.status(400).json({
          message: 'You cannot remove yourself from your favorite list!',
          status: 400
        });
      }

      const is_exist = await this.mentorMatcherService.isFavoriteExist(userId, mentor_id);
      if (!is_exist) {
        return res.status(400).json({
          message: 'Mentor is not in your favorite list!',
          status: 400
        });
      }

      const result = await this.mentorMatcherService.removeMentorFromFavorite(userId, mentor_id);
      return res.status(200).json({
        status: 200,
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
        return res.status(400).json({ errors: errors, message: 'Validation error', status: 400 });
      }

      const userId = req?.user?.id || 0 as number;
      const mentor_id = Number(req.query.mentor_id || 0);

      if (mentor_id === userId) {
        return res.status(400).json({
          message: 'You cannot add yourself to your favorite list!',
          status: 400
        });
      }

      const is_exist = await this.mentorMatcherService.isFavoriteExist(userId, mentor_id);
      if (is_exist) {
        return res.status(400).json({
          message: 'Mentor is already in your favorite list!',
          status: 400
        });
      }

      const result = await this.mentorMatcherService.addMentorToFavorite(userId, mentor_id);
      return res.status(200).json({
        status: 200,
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
        return res.status(400).json({ errors: errors, message: 'Validation error', status: 400 });
      }

      const userId = req?.user?.id || 0 as number;
      const request_id = Number(req.query.request_id || 0);

      const is_exist = await this.mentorMatcherService.findByIdForMentor(request_id, userId);
      if (!is_exist) {
        return res.status(401).json({
          message: 'You are not authorized to access this resource!',
          status: 401
        });
      }

      const result = await this.mentorMatcherService.signContract(userId, request_id);
      return res.status(200).json({
        status: 200,
        data: result ? "Contract signed successfully!" : "The contract has been signed already or you haven't accepted the mentor request yet!"
      });
    } catch (error) {
      next(error);
    }
  }
}
