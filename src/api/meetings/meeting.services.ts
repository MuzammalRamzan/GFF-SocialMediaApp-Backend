import moment from 'moment'
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

	async createMeeting(params: createMeetingParams): Promise<Meeting> {
		const meeting = await sequelize.transaction(async t => {
			const meeting = await Meeting.create(
				{
					createdBy: params.user_id,
					status: MeetingRequestStatus.SEND,
					startTime: moment(params.startTime).utc(),
					name: `Meeting - ${params.user_id} - ${params.participant_id}`,
					endTime: moment(params.endTime).utc(),
					isContractSigned: params.isContractSigned
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

	async acceptMeetingRequest(user_id: number, meeting_id: number): Promise<void> {
		const isPartOfMeeting = await MeetingParticipants.count({ where: { user_id, meeting_id } })

		if (!isPartOfMeeting) throw new GffError("You're not part of the meeting!", { errorCode: '400' })

		await Meeting.update({ status: MeetingRequestStatus.APPROVE }, { where: { id: meeting_id } })
	}

	async rejectMeetingRequest(user_id: number, meeting_id: number): Promise<void> {
		const isPartOfMeeting = await MeetingParticipants.count({ where: { user_id, meeting_id } })

		if (!isPartOfMeeting) throw new GffError("You're not part of the meeting!", { errorCode: '400' })

		await Meeting.update({ status: MeetingRequestStatus.REJECT }, { where: { id: meeting_id } })
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

		return meets
	}
}
