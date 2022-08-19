import { UserInformationType } from './../user-information/interface'
import {
	IMentorMatcherService,
	IMentorRequest,
	ISarchTermParams,
	ISearchMentors,
	removeMentorParams
} from './interface'
import { sequelize } from './../../database/index'
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
import { GffError } from '../helper/errorHandler'
import { MENTOR_FIELDS, USER_ADDITIONAL_INFORMATION_FIELDS, USER_INFORMATION_FIELDS } from '../../helper/db.helper'
import { UserRoleService } from '../user-role/userRoleService'
import { Associations } from '../association/association.model'
import { UserInformationService } from '../user-information/userInformationService'

export class MentorMatcherService implements IMentorMatcherService {
	private MENTOR_INFORMATION_FIELDS = MENTOR_FIELDS

	private USER_INFORMATION_FIELDS = USER_INFORMATION_FIELDS
	private USER_ADDITIONAL_INFORMATION_FIELDS = USER_ADDITIONAL_INFORMATION_FIELDS

	async getMentorRequestById(request_id: number): Promise<IMentorMatcher> {
		return (await MentorMatcherModel.findByPk(request_id))?.toJSON() as IMentorMatcher
	}

	async findMentors(userId: number, searchTerms: ISarchTermParams): Promise<ISearchMentors[]> {
		const _industry = searchTerms.industry?.split(',')
		const _role = searchTerms.role?.split(',')
		const _frequency = searchTerms.frequency?.split(',')
		const _conversation_mode = searchTerms.conversation_mode?.split(',')
		const _languages = searchTerms.languages?.split(',')

		const _distance = searchTerms.distance as number

		const mentorRole = await UserRoleService.fetchMentorRole()

		let mentorINformationWhere = {
			[Op.and]: [
				{
					industry: _industry?.length
						? {
							[Op.or]: _industry?.map((item: string) => ({
								[Op.like]: `%${item.trim()}%`
							}))
						}
						: { [Op.ne]: null }
				},
				{
					role: _role?.length
						? {
							[Op.or]: _role?.map((item: string) => ({
								[Op.like]: `%${item.trim()}%`
							}))
						}
						: { [Op.ne]: null }
				},
				{
					frequency: _frequency?.length
						? {
							[Op.or]: _frequency?.map((item: string) => ({
								[Op.like]: `%${item.trim()}%`
							}))
						}
						: { [Op.ne]: null }
				},
				{
					conversation_mode: _conversation_mode?.length
						? {
							[Op.or]: _conversation_mode?.map((item: string) => ({
								[Op.like]: `%${item.trim()}%`
							}))
						}
						: { [Op.ne]: null }
				},
				{
					languages: _languages?.length
						? {
							[Op.or]: _languages?.map((item: string) => ({
								[Op.like]: `%${item.trim()}%`
							}))
						}
						: { [Op.ne]: null }
				}
			]
		}

		let userIds: number[] = []

		if (_distance) {
			userIds = await UserInformationService.getNearByUsers(userId, _distance)
		}

		const mentors = await User.findAll({
			where: {
				[Op.and]: [
					searchTerms.text
						? where(fn('lower', col('full_name')), 'LIKE', `%${(searchTerms.text || '').trim().toLowerCase()}%`)
						: { full_name: { [Op.ne]: null } },
					{ id: userIds.length ? userIds : { [Op.ne]: userId } },
					{ role_id: mentorRole?.get('id') }
				]
			},
			attributes: ['id', 'full_name'],
			include: [
				{
					model: MentorInformation,
					as: 'mentor_information',
					attributes: this.MENTOR_INFORMATION_FIELDS,
					where: mentorINformationWhere
				},
				{
					model: UserInformation,
					as: 'user_information',
					attributes: this.USER_ADDITIONAL_INFORMATION_FIELDS
				},
				{
					model: Associations,
					as: 'user_associations',
					attributes: ['id'],
					include: [
						{
							model: MentorMatcherModel,
							as: 'mentor_matcher_associations',
							where: {
								mentee_id: userId,
								request_type: MentorMatcherRequestType.MENTOR
							},
							required: true
						}
					]
				}
			]
		})

		return mentors.map(mentor => {
			const _data = mentor.get()
			return {
				id: _data.id,
				full_name: _data.full_name,
				mentor_information: _data.mentor_information,
				user_information: {
					profile_url: _data?.user_information?.profile_url,
					bio: _data?.user_information?.bio,
					date_of_birth: _data?.user_information?.date_of_birth,
					gender: _data?.user_information?.gender,
					country: _data?.user_information?.country,
					job_role: _data?.user_information?.job_role,
					education: _data?.user_information?.education,
					latitude: _data?.user_information?.latitude,
					longitude: _data?.user_information?.longitude
				},
				mentor_matcher_request: _data?.user_associations
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
							attributes: this.MENTOR_INFORMATION_FIELDS
						},
						{
							model: UserInformation,
							as: 'user_information',
							attributes: this.USER_INFORMATION_FIELDS
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

		await Associations.bulkCreate([
			{ user_id: mentor_id, mentor_matcher_id: mentor.getDataValue('id') },
			{ user_id: userId, mentor_matcher_id: mentor.getDataValue('id') }
		])

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
							attributes: this.USER_INFORMATION_FIELDS
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
							attributes: this.USER_INFORMATION_FIELDS
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
							attributes: this.MENTOR_INFORMATION_FIELDS
						},
						{
							model: UserInformation,
							as: 'user_information',
							attributes: this.USER_INFORMATION_FIELDS
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

	async removeMentor(request_id: number, params: removeMentorParams): Promise<number> {
		return await MentorMatcherModel.destroy({
			where: {
				id: request_id,
				...(params.mentee_id ? { mentee_id: params.mentee_id } : { mentor_id: params.mentor_id })
			}
		})
	}
}
