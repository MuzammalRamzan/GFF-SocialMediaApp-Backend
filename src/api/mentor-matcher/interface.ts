import { IAuthenticatedRequest } from "../helper/authMiddleware"
import { User } from "../user/userModel"
import { IMentorMatcher } from "./mentorMatcherModel"

export interface IMentorMatcherService {
  findMentors(userId: number, searchTerm: string): Promise<User[]>
  myMentors(userId: number): Promise<IMentorRequest[]>
  myMentees(userId: number): Promise<IMentorRequest[]>
  sendMentorRequest(userId: number, mentor_id: number): Promise<IMentorMatcher>
  isExist(userId: number, mentor_id: number): Promise<boolean>
  acceptMentorRequest(request_id: number, userId: number, mentor_id: number): Promise<boolean>
  rejectMentorRequest(request_id: number, userId: number, mentor_id: number): Promise<boolean>
  getMentorRequests(userId: number): Promise<IMentorRequest[]>
  getMentorRequestsByMenteeId(userId: number): Promise<IMentorRequest[]>
  addMentorToFavorite(userId: number, mentor_id: number): Promise<boolean>
  removeMentorFromFavorite(userId: number, mentor_id: number): Promise<boolean>
  isFavoriteExist(userId: number, mentor_id: number): Promise<boolean>
  signContract(userId: number, mentor_id: number): Promise<boolean>
  findByIdForMentor(request_id:number, userId: number): Promise<IMentorMatcher>
}

export interface IMentorRequest {
  id: number
  mentor_id: number
  mentee_id: number
  request_type: string
  status?: string
  mentee?: {
    id: number
    firstname: string
    lastname: string
  }
  mentor?: {
    id: number
    firstname: string
    lastname: string
  }
}

export interface MentorMatcherAuthRequest extends IAuthenticatedRequest {
  mentor_id: number;
}