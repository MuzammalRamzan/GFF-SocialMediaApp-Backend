import { NextFunction, Response } from "express";
import { YOTI_IDENTITY_VERIFICATION_STATUS } from "../../constants";
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
    const data = await this.verificationService.verifySession(userId);
    const checks = data.get('yoti_checks') as any[];

    let status = YOTI_IDENTITY_VERIFICATION_STATUS.DONE;

    for (const check of checks) {
      if (check.state !== YOTI_IDENTITY_VERIFICATION_STATUS.DONE) {
        status = check.state;
        break
      }
    }

    res.status(200).json({
      data: {
        isVerified: data.get('is_verified'),
        status: checks.length ? status : null,
      },
      message: 'Session verification successfully completed!',
      code: 200
    })
  }
}