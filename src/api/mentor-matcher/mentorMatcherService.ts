import { IMentorMatcherService, IMentorRequest, ISarchTermParams, ISearchMentors } from './interface'
import { User } from '../user/userModel'
import { col, fn, Op, where } from 'sequelize'
import {
	IMentorMatcher,
	MentorMatcherModel,
	MentorMatcherRequestStatus,
	MentorMatcherRequestType
} from './mentorMatcherModel'
import { MentorInformation } from '../mentor-information/mentorInformationModel'
import { UserInformation } from '../user-information/userInformationModel'
import { MENTOR_ROLE_ID } from '../../constants'
import { GffError } from '../helper/errorHandler'

export class MentorMatcherService implements IMentorMatcherService {
	async findMentors(userId: number, searchTerms: ISarchTermParams): Promise<ISearchMentors[]> {
		const _industry = searchTerms.industry?.split(',')
		const _role = searchTerms.role?.split(',')
		const _frequency = searchTerms.frequency?.split(',')
		const _conversation_mode = searchTerms.conversation_mode?.split(',')

		const mentors = await User.findAll({
			where: {
				[Op.and]: [
					where(fn('lower', col('full_name')), 'LIKE', `%${(searchTerms.text || '').trim().toLowerCase()}%`),
					{ id: { [Op.ne]: userId } },
					{ role_id: MENTOR_ROLE_ID }
				]
			},
			attributes: ['id', 'full_name'],
			include: [
				{
					model: MentorInformation,
					as: 'mentor_information',
					attributes: ['industry', 'role', 'frequency', 'conversation_mode', 'isPassedIRT'],
					where: {
						[Op.or]: [
							{
								industry: {
									[Op.or]:
										_industry?.length &&
										_industry?.map((item: string) => ({
											[Op.like]: `%${item.trim()}%`
										}))
								}
							},
							{
								role: {
									[Op.or]:
										_role?.length &&
										_role?.map((item: string) => ({
											[Op.like]: `%${item.trim()}%`
										}))
								}
							},
							{
								frequency: {
									[Op.or]:
										_frequency?.length &&
										_frequency?.map((item: string) => ({
											[Op.like]: `%${item.trim()}%`
										}))
								}
							},
							{
								conversation_mode: {
									[Op.or]:
										_conversation_mode?.length &&
										_conversation_mode?.map((item: string) => ({
											[Op.like]: `%${item.trim()}%`
										}))
								}
							}
						]
					}
				},
				{
					model: UserInformation,
					as: 'user_information',
					attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education']
				}
			]
		})

		return mentors.map(mentor => {
			const _data = mentor.get()
			return {
				id: _data.id,
				full_name: _data.full_name,
				mentor_information: {
					industry: _data.mentor_information.industry.split(','),
					role: _data.mentor_information.role.split(','),
					frequency: _data.mentor_information.frequency.split(','),
					conversation_mode: _data.mentor_information.conversation_mode.split(','),
					isPassedIRT: _data.mentor_information.isPassedIRT
				},
				user_information: {
					profile_url: _data.user_information.profile_url,
					bio: _data.user_information.bio,
					date_of_birth: _data.user_information.date_of_birth,
					gender: _data.user_information.gender,
					country: _data.user_information.country,
					job_role: _data.user_information.job_role,
					education: _data.user_information.education
				}
			}
		})
	}

	async myMentors(userId: number): Promise<IMentorRequest[]> {
		const mentors = await MentorMatcherModel.findAll({
			where: {
				mentee_id: userId,
				status: MentorMatcherRequestStatus.APPROVE
			},
			include: [
				{
					model: User,
					as: 'mentor',
					attributes: ['id', 'full_name'],
					foreignKey: 'mentor_id',
					include: [
						{
							model: MentorInformation,
							as: 'mentor_information',
							attributes: ['industry', 'role', 'frequency', 'conversation_mode', 'isPassedIRT']
						},
						{
							model: UserInformation,
							as: 'user_information',
							attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education']
						}
					]
				}
			]
		})

		return mentors.map(mentor => {
			const mentor_request = mentor.get()
			return {
				mentor: mentor_request.mentor.get(),
				request_type: mentor_request.request_type,
				status: mentor_request.status,
				id: mentor_request.id,
				mentor_id: mentor_request.mentor_id,
				mentee_id: mentor_request.mentee_id,
				is_contract_signed_by_mentor: mentor_request.is_contract_signed_by_mentor,
				is_contract_signed_by_mentee: mentor_request.is_contract_signed_by_mentee
			}
		})
	}

	async sendMentorRequest(userId: number, mentor_id: number, message: string): Promise<IMentorMatcher> {
		const mentor = await MentorMatcherModel.create({
			mentor_id: mentor_id,
			mentee_id: userId,
			message: message,
			request_type: MentorMatcherRequestType.MENTOR,
			status: MentorMatcherRequestStatus.SEND
		})

		return mentor.get()
	}

	static async isExist(userId: number, mentor_id: number): Promise<MentorMatcherModel> {
		const mentor = await MentorMatcherModel.findOne({
			where: {
				mentee_id: userId,
				mentor_id: mentor_id
			}
		})

		return mentor?.get()
	}

	async isFavoriteExist(userId: number, mentor_id: number): Promise<boolean> {
		const mentor = await MentorMatcherModel.findOne({
			where: {
				mentee_id: userId,
				mentor_id: mentor_id,
				request_type: MentorMatcherRequestType.FAVORITE
			}
		})

		return mentor?.get() ? true : false
	}

	async acceptMentorRequest(request_id: number, userId: number): Promise<boolean> {
		const data = await MentorMatcherModel.update(
			{
				status: MentorMatcherRequestStatus.APPROVE
			},
			{
				where: {
					id: request_id,
					mentor_id: userId,
					status: MentorMatcherRequestStatus.SEND,
					request_type: MentorMatcherRequestType.MENTOR
				},
				fields: ['status']
			}
		)

		return data[0] ? true : false
	}

	async rejectMentorRequest(request_id: number, userId: number): Promise<boolean> {
		const data = await MentorMatcherModel.update(
			{
				status: MentorMatcherRequestStatus.REJECT
			},
			{
				where: {
					id: request_id,
					mentor_id: userId,
					status: MentorMatcherRequestStatus.SEND,
					request_type: MentorMatcherRequestType.MENTOR
				},
				fields: ['status']
			}
		)

		return data[0] ? true : false
	}

	async myMentees(userId: number): Promise<IMentorRequest[]> {
		const mentees = await MentorMatcherModel.findAll({
			where: {
				mentor_id: userId,
				status: MentorMatcherRequestStatus.APPROVE
			},
			include: [
				{
					model: User,
					as: 'mentee',
					attributes: ['id', 'full_name'],
					foreignKey: 'mentee_id',
					include: [
						{
							model: UserInformation,
							as: 'user_information',
							attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education']
						}
					]
				}
			]
		})

		return mentees.map(mentee => {
			const mentor_request = mentee.get()
			return {
				mentee: mentor_request.mentee.get(),
				request_type: mentor_request.request_type,
				status: mentor_request.status,
				id: mentor_request.id,
				mentor_id: mentor_request.mentor_id,
				mentee_id: mentor_request.mentee_id,
				is_contract_signed_by_mentor: mentor_request.is_contract_signed_by_mentor,
				is_contract_signed_by_mentee: mentor_request.is_contract_signed_by_mentee
			}
		})
	}

	async getMentorRequests(userId: number): Promise<IMentorRequest[]> {
		const requests = await MentorMatcherModel.findAll({
			where: {
				mentor_id: userId,
				status: MentorMatcherRequestStatus.SEND
			},
			include: [
				{
					model: User,
					as: 'mentee',
					attributes: ['id', 'full_name'],
					foreignKey: 'mentee_id',
					include: [
						{
							model: UserInformation,
							as: 'user_information',
							attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education']
						}
					]
				}
			]
		})

		return requests.map(request => {
			const mentor_request = request.get()
			return {
				mentee: mentor_request.mentee.get(),
				request_type: mentor_request.request_type,
				status: mentor_request.status,
				id: mentor_request.id,
				mentor_id: mentor_request.mentor_id,
				mentee_id: mentor_request.mentee_id,
				is_contract_signed_by_mentor: mentor_request.is_contract_signed_by_mentor,
				is_contract_signed_by_mentee: mentor_request.is_contract_signed_by_mentee
			}
		})
	}

	async getMentorRequestsByMenteeId(userId: number): Promise<IMentorRequest[]> {
		const requests = await MentorMatcherModel.findAll({
			where: {
				mentee_id: userId,
				status: MentorMatcherRequestStatus.SEND
			},
			include: [
				{
					model: User,
					as: 'mentor',
					attributes: ['id', 'full_name'],
					foreignKey: 'mentor_id',
					include: [
						{
							model: MentorInformation,
							as: 'mentor_information',
							attributes: ['industry', 'role', 'frequency', 'conversation_mode', 'isPassedIRT']
						},
						{
							model: UserInformation,
							as: 'user_information',
							attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education']
						}
					]
				}
			]
		})

		return requests.map(request => {
			const mentor_request = request.get()
			return {
				mentor: mentor_request.mentor.get(),
				request_type: mentor_request.request_type,
				status: mentor_request.status,
				id: mentor_request.id,
				mentor_id: mentor_request.mentor_id,
				mentee_id: mentor_request.mentee_id,
				is_contract_signed_by_mentor: mentor_request.is_contract_signed_by_mentor,
				is_contract_signed_by_mentee: mentor_request.is_contract_signed_by_mentee
			}
		})
	}

	async removeMentorFromFavorite(userId: number, mentor_id: number): Promise<boolean> {
		const data = await MentorMatcherModel.destroy({
			where: {
				mentor_id: mentor_id,
				mentee_id: userId,
				request_type: MentorMatcherRequestType.FAVORITE
			}
		})

		return data ? true : false
	}

	async addMentorToFavorite(userId: number, mentor_id: number): Promise<boolean> {
		const data = await MentorMatcherModel.create({
			mentor_id: mentor_id,
			mentee_id: userId,
			request_type: MentorMatcherRequestType.FAVORITE
		})

		return data ? true : false
	}

	async findById(id: number, userId: number): Promise<IMentorMatcher> {
		const data = await MentorMatcherModel.findOne({
			where: {
				id: id,
				[Op.or]: [
					{
						mentor_id: userId
					},
					{
						mentee_id: userId
					}
				]
			}
		})

		return data?.get()
	}

	async signContract(userId: number, request_id: number): Promise<boolean> {
		try {
			const request = await MentorMatcherModel.findOne({
				where: {
					id: request_id,
					request_type: MentorMatcherRequestType.MENTOR,
					status: MentorMatcherRequestStatus.APPROVE,
					[Op.or]: [
						{
							mentor_id: userId
						},
						{
							mentee_id: userId
						}
					]
				}
			})

			if (!request) {
				const error = new GffError('Request not found')
				error.errorCode = '404'
				throw error
			}

			if (request.get().mentor_id === userId) {
				request.set('is_contract_signed_by_mentor', true)
			}

			if (request.get().mentee_id === userId) {
				request.set('is_contract_signed_by_mentee', true)
			}

			await request.save()

			return true
		} catch (error) {
			return false
		}
	}
}
