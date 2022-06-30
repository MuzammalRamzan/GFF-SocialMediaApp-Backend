import { MentorMatcherModel } from '../mentor-matcher/mentorMatcherModel'
import { UserInformation } from '../user-information/userInformationModel'
import { IMentorInformation } from './mentorInformationModel'

export type CreateMentorInformation = {
	user_id: number
	isPassedIRT: boolean
	industry: string[]
	role: string[]
	frequency: string[]
	conversation_mode: string[]
	languages: string[]
}

export type MentorInformationType = {
	id: number
	user_information: UserInformation
	mentor_information: IMentorInformation
	mentor_request: MentorMatcherModel
}

export interface IMentorInformationService {
	createMentorInformation(params: CreateMentorInformation): Promise<IMentorInformation>
	isMentorInformationExist(userId: number): Promise<boolean>
	updateMentorInformation(params: CreateMentorInformation): Promise<IMentorInformation>
	getMentorInformation(userId: number, mentor_id: number): Promise<MentorInformationType>
	getMentorInfo(mentor_id: number): Promise<IMentorInformation | null>
}
