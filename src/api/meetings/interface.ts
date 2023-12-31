import { IQuestionnaireAnswer } from '../questionnaire/interface'
import { Meeting } from './meeting.model'

export enum MeetingRequestStatus {
	SEND = 'send',
	APPROVE = 'approve',
	REJECT = 'reject'
}

export type createMeetingParams = {
	startTime: number
	endTime: number
	user_id: number
	participant_id: number
	isContractSigned: boolean
	answers?: IQuestionnaireAnswer[]
	message?: string
}

export interface IMeetingServices {
	createMeeting(params: createMeetingParams): Promise<Meeting>
	acceptMeetingRequest(user_id: number, meeting_id: number, isContractSigned: boolean): Promise<void>
	rejectMeetingRequest(user_id: number, meeting_id: number, message: string): Promise<void>
	getMeetings(user_id: number): Promise<Meeting[]>
	getPastMeetings(user_id: number): Promise<Meeting[]>
}
