import { MentorMatcherService } from '../mentor-matcher/mentorMatcherService'
import { UserInformation } from '../user-information/userInformationModel'
import { User } from '../user/userModel'
import { CreateMentorInformation, IMentorInformationService, MentorInformationType } from './interface'
import { IMentorInformation, MentorInformation } from './mentorInformationModel'
import { GffError } from '../helper/errorHandler'
import { UserRoleService } from '../user-role/userRoleService'
import { USER_INFORMATION_FIELDS } from '../../helper/db.helper'

export class MentorInformationService implements IMentorInformationService {
	static async isMentorExists(userId: number): Promise<boolean> {
		const mentorRole = await UserRoleService.fetchMentorRole()

		const record = await User.findOne({
			where: {
				id: userId,
				role_id: mentorRole?.get('id')
			}
		})

		return !!record?.get()
	}

	async createMentorInformation(params: CreateMentorInformation): Promise<IMentorInformation> {
		const mentorRole = await UserRoleService.fetchMentorRole()

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
				role_id: mentorRole?.get('id')
			},
			{
				where: {
					id: params.user_id
				}
			}
		)

		return mentorInformation.toJSON()
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
			role: (params.role || []).join(','),
			industry: (params.industry || []).join(','),
			frequency: (params.frequency || []).join(','),
			conversation_mode: (params.conversation_mode || []).join(','),
			languages: (params.languages || []).join(','),
			isPassedIRT: params.isPassedIRT
		})

		return mentorInformation.toJSON()
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
			attributes: USER_INFORMATION_FIELDS
		})

		const mentor_request = (await MentorMatcherService.isExist(userId, mentor_id)) as any

		return {
			id: mentor_id,
			user_information: userInformation?.get(),
			mentor_information: mentorInformation.toJSON(),
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

		return mentorInformation.toJSON()
	}

	async getAllMentors(): Promise<MentorInformation[]> {
		const mentors = await MentorInformation.findAll({
			include: [
				{
					model: User,
					as: 'user',
					attributes: { exclude: ['password'] },
					include: [{ model: UserInformation, as: 'user_information', attributes: ['profile_url'] }]
				}
			]
		})
		return mentors.map(mentor => {
			const mentorInfo = mentor.toJSON()
			let user = mentorInfo['user']
			delete mentorInfo['user']
			user = { ...user, mentor: mentorInfo }
			return user
		})
	}
}
