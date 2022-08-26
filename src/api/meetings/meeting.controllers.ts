import { NextFunction, Response } from 'express'
import { IAuthenticatedRequest } from '../helper/authMiddleware'
import { GffError } from '../helper/errorHandler'
import { MentorInformationService } from '../mentor-information/mentorInformationService'
import { IQuestionnaireAnswer } from '../questionnaire/interface'
import { WarriorInformationService } from '../warrior-information/warriorInformationService'
import { MeetingServices } from './meeting.services'

export class MeetingController {
	private readonly meetingServices: MeetingServices

	constructor() {
		this.meetingServices = new MeetingServices()
	}

	private validateIsParticipantMentorOrWarrior = async (participant_id: number) => {
		const isParticipantMentorOrWarrior =
			(await MentorInformationService.isMentorExists(participant_id)) ||
			(await WarriorInformationService.isUserWarrior(participant_id))

		if (!isParticipantMentorOrWarrior)
			throw new GffError('Participant should be either Mentor or Warrior!', { errorCode: '400' })
	}

	createMeeting = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const user_id = req.user?.id as number
			const startTime = req.body.startTime as number
			const endTime = req.body.endTime as number
			const participant_id = req.body.participant_id as number
			const isContractSigned = req.body.isContractSigned as boolean
			const answers = req.body.answers as IQuestionnaireAnswer[]
			const message = req.body.message as string

			if (startTime === endTime) throw new GffError('Start time and end time should not be same!', { errorCode: '400' })

			const meeting = await this.meetingServices.createMeeting({
				user_id,
				participant_id,
				startTime,
				endTime,
				isContractSigned,
				answers,
				message
			})

			return res.status(200).json({ data: { meeting }, code: 200, message: 'OK' })
		} catch (error) {
			next(error)
		}
	}

	acceptMeetingRequest = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const user_id = req.user?.id as number
			const meeting_id = req.body.meeting_id as number
			const isContractSigned = req.body.isContractSigned as boolean

			await this.validateIsParticipantMentorOrWarrior(user_id)

			await this.meetingServices.acceptMeetingRequest(user_id, meeting_id, isContractSigned)

			return res.status(200).json({ data: {}, message: 'Meeting request has been accepted!', code: 200 })
		} catch (error) {
			next(error)
		}
	}

	rejectMeetingRequest = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const user_id = req.user?.id as number
			const meeting_id = req.body.meeting_id as number
			const message = req.body.message as string

			await this.validateIsParticipantMentorOrWarrior(user_id)

			await this.meetingServices.rejectMeetingRequest(user_id, meeting_id, message)

			return res.status(200).json({ data: {}, message: 'Meeting request has been rejected!', code: 200 })
		} catch (error) {
			next(error)
		}
	}

	getMeetings = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const user_id = req.user?.id as number

			const meetings = await this.meetingServices.getMeetings(user_id)

			return res.status(200).json({ data: { meetings }, code: 200, message: 'OK' })
		} catch (error) {
			next(error)
		}
	}

	getPastMeetings = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const user_id = req.user?.id as number

			const meetings = await this.meetingServices.getPastMeetings(user_id)

			return res.status(200).json({ data: { meetings }, code: 200, message: 'OK' })
		} catch (error) {
			next(error)
		}
	}
}
