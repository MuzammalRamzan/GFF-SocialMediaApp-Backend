import { NextFunction, Response } from "express";
import { IAuthenticatedRequest } from "../helper/authMiddleware";
import { VerificationService } from "./verification.service";

export class IdentityVerificationController {
  private readonly verificationService: VerificationService;
  constructor() {
    this.verificationService = new VerificationService();
  }

  public async createSession(req: IAuthenticatedRequest, res: Response, next: NextFunction) {
    const userId = req?.user?.id as number;

    const data = await this.verificationService.createSession(userId);

    const isSessionCreated = data.clientSessionToken && data.sessionId ? true : false;

    return res.status(200).json({
      data,
      message: isSessionCreated ? 'Session created successfully' : 'User verified successfully!',
      code: 200
    })
  }

  public async verifySession(req: IAuthenticatedRequest, res: Response, next: NextFunction) {
    const userId = req?.user?.id as number;

    await this.verificationService.verifySession(userId);
    res.status(200).json({
      data: {},
      message: 'Session verification successfully completed!',
      code: 200
    })
  }
}