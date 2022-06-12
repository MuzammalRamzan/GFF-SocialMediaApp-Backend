import { NextFunction, Response } from "express";
import { IAuthenticatedRequest } from "../helper/authMiddleware";
import { MentorInformationService } from "./mentorInformationService";

export class MentorInformationController {
  private mentorInformationService: MentorInformationService;

  constructor() {
    this.mentorInformationService = new MentorInformationService();
  }

  createMentorInformation = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id || 0 as number;

      const isExists = await this.mentorInformationService.isMentorInformationExist(userId);

      if (isExists) {
        return res.status(400).json({
          message: "Mentor information already exists"
        });
      }

      const mentorInformation = await this.mentorInformationService.createMentorInformation(Object.assign(req.body, {
        user_id: userId
      }));
      return res.status(200).json({ mentorInformation });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  updateMentorInformation = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id || 0 as number;

      const mentorInformation = await this.mentorInformationService.updateMentorInformation(Object.assign(req.body, {
        user_id: userId
      }));

      return res.status(200).json({ mentorInformation });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  getMentorInformation = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id || 0 as number;
      const mentor_id = Number(req.params.mentor_id || 0);

      if(!userId || !mentor_id) {
        return res.status(400).json({
          message: "Invalid request"
        });
      }

      const data = await this.mentorInformationService.getMentorInformation(userId, mentor_id);

      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}