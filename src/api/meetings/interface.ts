import { Meeting } from './meeting.model'

export enum MeetingRequestStatus {
	SEND = 'send',
	APPROVE = 'approve',
	REJECT = 'reject'
}

export type createMeetingParams = {
	startTime: string
	user_id: number
	participant_id: number
}

export interface IMeetingServices {
	createMeeting(params: createMeetingParams): Promise<Meeting>
	acceptMeetingRequest(user_id: number, meeting_id: number): Promise<void>
	rejectMeetingRequest(user_id: number, meeting_id: number): Promise<void>
	getMeetings(user_id: number): Promise<Meeting[]>
}
