import { MENTOR_ROLE_ID } from '../../constants'
import { MentorMatcherService } from '../mentor-matcher/mentorMatcherService'
import { UserInformation } from '../user-information/userInformationModel'
import { User } from '../user/userModel'
import { CreateMentorInformation, IMentorInformationService, MentorInformationType } from './interface'
import { IMentorInformation, MentorInformation } from './mentorInformationModel'
import { GffError } from '../helper/errorHandler'

export class MentorInformationService implements IMentorInformationService {
	static async isMentorExists(userId: number): Promise<boolean> {
		const record = await User.findOne({
			where: {
				id: userId,
				role_id: MENTOR_ROLE_ID
			}
		})

		return !!record?.get()
	}

	async createMentorInformation(params: CreateMentorInformation): Promise<IMentorInformation> {
		const mentorInformation = await MentorInformation.create({
			role: (params.role || []).join(','),
			industry: (params.industry || []).join(','),
			frequency: (params.frequency || []).join(','),
			conversation_mode: (params.conversation_mode || []).join(','),
			languages: (params.languages || []).join(','),
			user_id: params.user_id,
			isPassedIRT: params.isPassedIRT
		})

		// make user as a mentor, change the role_id of User table.
		await User.update(
			{
				role_id: MENTOR_ROLE_ID
			},
			{
				where: {
					id: params.user_id
				}
			}
		)

		return mentorInformation.get()
	}

	async isMentorInformationExist(userId: number): Promise<boolean> {
		const mentorInformation = await MentorInformation.findOne({
			where: {
				user_id: userId
			}
		})

		return !!mentorInformation?.get()
	}

	async updateMentorInformation(params: CreateMentorInformation): Promise<IMentorInformation> {
		const mentorInformation = await MentorInformation.findOne({
			where: {
				user_id: params.user_id
			}
		})

		if (!mentorInformation) {
			const error = new GffError('Mentor information not found')
			error.errorCode = '404'
			throw error
		}

		await mentorInformation.update({
			role: params.role.join(','),
			industry: params.industry.join(','),
			frequency: params.frequency.join(','),
			conversation_mode: params.conversation_mode.join(','),
			languages: params.languages.join(','),
			isPassedIRT: params.isPassedIRT
		})

		return mentorInformation.get()
	}

	async getMentorInformation(userId: number, mentor_id: number): Promise<MentorInformationType> {
		const mentorInformation = await MentorInformation.findOne({
			where: {
				user_id: mentor_id
			},
			attributes: ['isPassedIRT', 'industry', 'role', 'frequency', 'conversation_mode', 'languages']
		})

		if (!mentorInformation) {
			const error = new GffError('Mentor information not found')
			error.errorCode = '404'
			throw error
		}

		const userInformation = await UserInformation.findOne({
			where: {
				user_id: mentor_id
			},
			attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education']
		})

		const mentor_request = (await MentorMatcherService.isExist(userId, mentor_id)) as any

		const mentor_information = mentorInformation.get()

		return {
			id: mentor_id,
			user_information: userInformation?.get(),
			mentor_information: {
				industry: (mentor_information.industry || '').split(',').filter((item: string) => !!item),
				role: (mentor_information.role || '').split(',').filter((item: string) => !!item),
				frequency: (mentor_information.frequency || '').split(',').filter((item: string) => !!item),
				conversation_mode: (mentor_information.conversation_mode || '').split(',').filter((item: string) => !!item),
				languages: (mentor_information.languages || '').split(',').filter((item: string) => !!item),
				isPassedIRT: mentor_information.isPassedIRT,
				id: mentor_information.id,
				user_id: mentor_information.user_id
			},
			mentor_request: mentor_request
		}
	}

	async getMentorInfo(mentor_id: number): Promise<IMentorInformation | null> {
		const mentorInformation = await MentorInformation.findOne({
			where: {
				user_id: mentor_id
			},
			attributes: ['isPassedIRT', 'industry', 'role', 'frequency', 'conversation_mode', 'languages']
		})

		if (!mentorInformation) return null

		const mentor_information = mentorInformation.get()

		return {
			industry: (mentor_information.industry || '').split(',').filter((item: string) => !!item),
			role: (mentor_information.role || '').split(',').filter((item: string) => !!item),
			frequency: (mentor_information.frequency || '').split(',').filter((item: string) => !!item),
			conversation_mode: (mentor_information.conversation_mode || '').split(',').filter((item: string) => !!item),
			languages: (mentor_information.languages || '').split(',').filter((item: string) => !!item),
			isPassedIRT: mentor_information.isPassedIRT,
			id: mentor_information.id,
			user_id: mentor_information.user_id
		}
	}
}
