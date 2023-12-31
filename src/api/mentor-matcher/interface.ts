import { IAuthenticatedRequest } from '../helper/authMiddleware'
import { IMentorMatcher } from './mentorMatcherModel'

export type removeMentorParams = { mentee_id?: number; mentor_id: number } | { mentee_id: number; mentor_id?: number }

export interface IMentorMatcherService {
	findMentors(userId: number, searchTerms: ISarchTermParams): Promise<ISearchMentors[]>
	myMentors(userId: number): Promise<IMentorRequest[]>
	myMentees(userId: number): Promise<IMentorRequest[]>
	sendMentorRequest(userId: number, mentor_id: number, message: string): Promise<IMentorMatcher>
	acceptMentorRequest(request_id: number, userId: number): Promise<boolean>
	rejectMentorRequest(request_id: number, userId: number): Promise<boolean>
	getMentorRequests(userId: number): Promise<IMentorRequest[]>
	getMentorRequestsByMenteeId(userId: number): Promise<IMentorRequest[]>
	addMentorToFavorite(userId: number, mentor_id: number): Promise<boolean>
	removeMentorFromFavorite(userId: number, mentor_id: number): Promise<boolean>
	isFavoriteExist(userId: number, mentor_id: number): Promise<boolean>
	signContract(userId: number, mentor_id: number): Promise<boolean>
	findById(request_id: number, userId: number): Promise<IMentorMatcher>
	getMentorRequestById(request_id: number): Promise<IMentorRequest>
	removeMentor(request_id: number, params: removeMentorParams): Promise<number>
}

export interface IMentorRequest {
	id: number
	mentor_id: number
	mentee_id: number
	request_type: string
	status?: string
	is_contract_signed_by_mentee: boolean
	is_contract_signed_by_mentor: boolean
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

export interface ISearchMentors {
	id: number
	full_name: string
	mentor_information: {
		industry: string[]
		role: string[]
		frequency: string[]
		conversation_mode: string[]
		isPassedIRT: boolean
		languages: string[]
	}
	user_information: {
		profile_url: string
		bio: string
		date_of_birth: string
		gender: string
		country: string
		job_role: string
		education: string
		latitude: string
		longitude: string
	}
	mentor_matcher_request: {
		id: number
		mentor_matcher_associations: IMentorRequest
	}
}

export interface MentorMatcherAuthRequest extends IAuthenticatedRequest {
	mentor_id: number
}

export interface ISarchTermParams {
	industry?: string
	role?: string
	frequency?: string
	conversation_mode?: string
	languages?: string
	text?: string
	latitude?: String
	longitude?: String
	distance?: number
}
