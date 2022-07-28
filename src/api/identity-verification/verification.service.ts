import path from 'path';
import fs from 'fs';
import {
  DocScanClient,
  SessionSpecificationBuilder,
  RequestedDocumentAuthenticityCheckBuilder,
  RequestedLivenessCheckBuilder,
  RequestedTextExtractionTaskBuilder,
  RequestedFaceMatchCheckBuilder,
  SdkConfigBuilder
  // @ts-ignore
} from "yoti"
import { Verification } from './verification.model';
import { YOTI_IDENTITY_VERIFICATION_STATE } from '../../constants';
import { ICreateSession } from './interface';

const CONSTANTS = {
  YOTI_CLIENT_SDK_ID: process.env.YOTI_CLIENT_SDK_ID,
  FRONT_END_URL: "",
  VERIFICATION_SUCCESS_ROUTE: "/yoti/success",
  VERIFICATION_ERROR_ROUTE: "/yoti/error",
};

const pemFilePath = path.join(__dirname, '../../keys/dev.pem');
const YOTI_PEM = fs.readFileSync(pemFilePath);

const docScanClient = new DocScanClient(CONSTANTS.YOTI_CLIENT_SDK_ID, YOTI_PEM);

export class VerificationService {
  private readonly documentAuthenticityCheck;
  private readonly livenessCheck;
  private readonly faceMatchCheck;
  private readonly textExtractionTask;
  private readonly sdkConfig;

  constructor() {
    // Document Authenticity Check
    this.documentAuthenticityCheck = new RequestedDocumentAuthenticityCheckBuilder().build();

    // Liveness check with 3 retries
    this.livenessCheck = new RequestedLivenessCheckBuilder()
      .forZoomLiveness()
      .withMaxRetries(3)
      .build();

    // Face Match Check with manual check set to fallback
    this.faceMatchCheck = new RequestedFaceMatchCheckBuilder()
      .withManualCheckFallback()
      .build();

    // ID Document Text Extraction Task with manual check set to fallback
    this.textExtractionTask = new RequestedTextExtractionTaskBuilder()
      .withManualCheckFallback()
      .build();

    // Configuration for the client SDK (Frontend)
    this.sdkConfig = new SdkConfigBuilder()
      .withAllowsCameraAndUpload()
      .withPresetIssuingCountry('USD')
      .withSuccessUrl(`${CONSTANTS.FRONT_END_URL}${CONSTANTS.VERIFICATION_SUCCESS_ROUTE}`)
      .withErrorUrl(`${CONSTANTS.FRONT_END_URL}${CONSTANTS.VERIFICATION_ERROR_ROUTE}`)
      .build();
  }

  private getSessionSpecs(userId: number): any {
    // Buiding the Session with defined specification from above
    const sessionSpec = new SessionSpecificationBuilder()
      .withClientSessionTokenTtl(600)
      .withResourcesTtl(604800)
      .withUserTrackingId(String(userId))
      .withRequestedCheck(this.documentAuthenticityCheck)
      .withRequestedCheck(this.livenessCheck)
      .withRequestedCheck(this.faceMatchCheck)
      .withRequestedTask(this.textExtractionTask)
      .withSdkConfig(this.sdkConfig)
      .build();

    return sessionSpec;
  }

  private async getUserVerification(userId: number): Promise<Verification> {
    const verification = await Verification.findOne({
      where: {
        user_id: userId
      }
    });

    if (verification) {
      return verification;
    }

    return Verification.create({
      user_id: userId,
    });
  }

  private async createVerificationSession(userId: number): Promise<any> {
    try {
      const sessionSpec = this.getSessionSpecs(userId);
      const session = await docScanClient
        .createSession(sessionSpec);

      return session;
    } catch (error) {
      console.log(error);
    }
  }

  public async verifySession(userId: number): Promise<Verification> {
    try {
      const verification = await this.getUserVerification(userId);

      const sessionId = verification.get('yoti_session_id');

      if (!sessionId) {
        return verification;
      }

      const session = await docScanClient.getSession(sessionId);
      const isApproved =
        session.checks?.length > 0
        && session.checks?.every((check: any) => check?.report?.recommendation?.value === YOTI_IDENTITY_VERIFICATION_STATE.APPROVE)

      if (session.state === YOTI_IDENTITY_VERIFICATION_STATE.COMPLETED && isApproved) {
        verification.set({
          is_verified: true,
        })
      }

      verification.set({
        identity_verification_status: session.state,
        yoti_session_id: session.sessionId,
        yoti_session_secret: session.clientSessionToken,
        yoti_session_result: session.resources,
        yoti_checks: session.checks,
      });

      await verification.save();

      return verification;
    } catch (error) {
      console.log(error);
      throw new Error('Yoti error!');
    }
  }


  public async createSession(userId: number): Promise<ICreateSession> {
    try {
      const verification = await this.getUserVerification(userId);
      const oldSessionId = verification.get('yoti_session_id');

      let session = null;

      if (oldSessionId) {
        session = await docScanClient.getSession(oldSessionId);

        switch (session.state) {
          case YOTI_IDENTITY_VERIFICATION_STATE.COMPLETED:
            return {
              clientSessionToken: null,
              sessionId: null,
            };

          case YOTI_IDENTITY_VERIFICATION_STATE.ONGOING:
            return {
              clientSessionToken: verification.get('yoti_session_secret') as string,
              sessionId: verification.get('yoti_session_id') as string,
            };

          default:
            break;
        }
      }
      session = await this.createVerificationSession(userId);

      const payload = {
        sessionId: session.sessionId,
        clientSessionToken: session.clientSessionToken,
      };

      verification.set(payload);

      await verification.save();

      return payload;
    } catch (error) {
      console.log(error);
      throw new Error('Yoti error!');
    }
  }
}