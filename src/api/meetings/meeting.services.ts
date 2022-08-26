import moment from 'moment'
import { Op } from 'sequelize'
import { sequelize } from '../../database'
import { USER_FIELDS, USER_INFORMATION_FIELDS } from '../../helper/db.helper'
import { GffError } from '../helper/errorHandler'
import { IQuestionnaireAnswer } from '../questionnaire/interface'
import { Questionnaire, QuestionnaireAnswers } from '../questionnaire/questionnaire.model'
import { QuestionnaireService } from '../questionnaire/questionnaire.services'
import { UserInformation } from '../user-information/userInformationModel'
import { User } from '../user/userModel'
import { IMeetingServices, MeetingRequestStatus, createMeetingParams } from './interface'
import { Meeting } from './meeting.model'
import { MeetingParticipants } from './meetingParticipants.model'

export class MeetingServices implements IMeetingServices {
	private readonly questionnaireService: QuestionnaireService

	constructor() {
		this.questionnaireService = new QuestionnaireService()
	}

	static filterMeetingParticipant(participant: any): any {
		return {
			id: participant.id,
			user_id: participant.user_id,
			full_name: participant?.user?.user_information?.full_name || null,
			profile_url: participant?.user?.user_information?.profile_url || null,
			bio: participant?.user?.user_information?.bio || null,
		}
	}

	static filterMeetingResponse(meeting: any): any {
		return {
			...meeting,
			participants: meeting?.participants?.map((item: any) => MeetingServices.filterMeetingParticipant(item)),
			answers: meeting?.answers?.map((item: any) => QuestionnaireService.filterAnswerObject(item))
		}
	}

	async createMeeting(params: createMeetingParams): Promise<Meeting> {
		const meeting = await sequelize.transaction(async t => {
			const meeting = await Meeting.create(
				{
					createdBy: params.user_id,
					status: MeetingRequestStatus.SEND,
					startTime: moment(params.startTime * 1000).utc(),
					name: `Meeting - ${params.user_id} - ${params.participant_id}`,
					endTime: moment(params.endTime * 1000).utc(),
					isContractSignedByClient: params.isContractSigned,
					description: params.message
				},
				{ transaction: t }
			)

			const meeting_id = meeting.getDataValue('id')

			await MeetingParticipants.bulkCreate(
				[
					{
						meeting_id,
						user_id: params.user_id
					},
					{ meeting_id, user_id: params.participant_id }
				],
				{ transaction: t }
			)

			let answers: IQuestionnaireAnswer[]
			if (params?.answers && params?.answers.length) {
				answers = params.answers.map(answer => ({ ...answer, user_id: params.user_id, meeting_id }))
				await this.questionnaireService.saveAnswers(answers, t)
			}

			return meeting
		})

		return meeting
	}

	async acceptMeetingRequest(user_id: number, meeting_id: number, isContractSigned: boolean): Promise<void> {
		const isPartOfMeeting = await MeetingParticipants.count({ where: { user_id, meeting_id } })

		if (!isPartOfMeeting) throw new GffError("You're not part of the meeting!", { errorCode: '400' })

		await Meeting.update({ status: MeetingRequestStatus.APPROVE, isContractSignedByWarrior: isContractSigned }, { where: { id: meeting_id } })
	}

	async rejectMeetingRequest(user_id: number, meeting_id: number, message: string): Promise<void> {
		const isPartOfMeeting = await MeetingParticipants.count({ where: { user_id, meeting_id } })

		if (!isPartOfMeeting) throw new GffError("You're not part of the meeting!", { errorCode: '400' })

		await Meeting.update({
			status: MeetingRequestStatus.REJECT,
			canceledReason: message,
			canceledTime: moment().utc()
		}, { where: { id: meeting_id } })
	}

	async getMeetings(user_id: number): Promise<Meeting[]> {
		const meetings = await Meeting.findAll({
			include: [
				{
					model: MeetingParticipants,
					as: 'participants',
					required: true,
					where: { user_id }
				},
				{
					model: QuestionnaireAnswers,
					as: 'answers',
					required: false,
					include: [
						{
							model: Questionnaire,
							as: 'question',
						}
					]
				}
			]
		})

		const meets: any[] = []

		await Promise.all(
			meetings.map(async meeting => {
				const meeting_id = meeting.getDataValue('id')
				const participants = await MeetingParticipants.findAll({
					where: { meeting_id },
					include: [
						{
							model: User,
							as: 'user',
							attributes: USER_FIELDS,
							include: [{ model: UserInformation, as: 'user_information', attributes: USER_INFORMATION_FIELDS }]
						}
					]
				})

				meets.push({ ...meeting.toJSON(), participants: participants.map(r => r.toJSON()) })
			})
		)

		return meets.map(meeting => MeetingServices.filterMeetingResponse(meeting))
	}

	async getPastMeetings(user_id: number): Promise<Meeting[]> {
		const meetings = await Meeting.findAll({
			where: {
				startTime: {
					[Op.lt]: moment().utc()
				}
			},
			order: [['startTime', 'ASC']],
			include: [
				{
					model: MeetingParticipants,
					as: 'participants',
					required: true,
					where: { user_id }
				},
				{
					model: QuestionnaireAnswers,
					as: 'answers',
					required: false,
					include: [
						{
							model: Questionnaire,
							as: 'question',
						}
					]
				}
			]
		})

		const meets: any[] = []

		await Promise.all(
			meetings.map(async meeting => {
				const meeting_id = meeting.getDataValue('id')
				const participants = await MeetingParticipants.findAll({
					where: { meeting_id },
					include: [
						{
							model: User,
							as: 'user',
							attributes: USER_FIELDS,
							include: [{ model: UserInformation, as: 'user_information', attributes: USER_INFORMATION_FIELDS }]
						}
					]
				})

				meets.push({ ...meeting.toJSON(), participants: participants.map(r => r.toJSON()) })
			})
		)

		return meets.map(meeting => MeetingServices.filterMeetingResponse(meeting))
	}
}
