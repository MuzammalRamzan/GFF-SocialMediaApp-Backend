import { IAuthenticatedRequest } from "../helper/authMiddleware"
import { IMentorMatcher } from "./mentorMatcherModel"

export interface IMentorMatcherService {
  findMentors(userId: number, searchTerm: string): Promise<any[]>
  myMentors(userId: number): Promise<any[]>
  sendMentorRequest(userId: number, mentor_id: number): Promise<IMentorMatcher>
  isExist(userId: number, mentor_id: number): Promise<boolean>
  acceptMentorRequest(request_id: number, userId: number, mentor_id: number): Promise<boolean>
  rejectMentorRequest(request_id: number, userId: number, mentor_id: number): Promise<boolean>
}

export interface MentorMatcherAuthRequest extends IAuthenticatedRequest {
  mentor_id: number;
}