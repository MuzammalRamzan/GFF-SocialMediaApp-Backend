import { QueryTypes } from 'sequelize'
import { sequelize } from '../../database'
import { ISearchUser, IUserService, OtherUserInfo, PaginatedUserResult, UserInfo, UserType } from './interface'
import { User } from './userModel'
import { Op } from 'sequelize'
import { WarriorInformation } from '../warrior-information/warriorInformationModel'
import { UserInformation } from '../user-information/userInformationModel'
import { MentorInformation } from '../mentor-information/mentorInformationModel'
import { WellnessWarrior } from '../wellness-warrior/wellnessWarriorModel'
import { MentorMatcherModel } from '../mentor-matcher/mentorMatcherModel'
import { GffError } from '../helper/errorHandler'
import { FindFriendModel } from '../find-friend/findFriendModel'
import { paginate, PaginationType, USER_FIELDS, USER_INFORMATION_FIELDS } from '../../helper/db.helper'
import { HashtagService } from '../hashtag/hashtagService'
import { UserRole } from '../user-role/userRoleModel'
import { UserRoleService } from '../user-role/userRoleService'
import { MentorInformationService } from '../mentor-information/mentorInformationService'
import { WarriorInformationService } from '../warrior-information/warriorInformationService'

export class UserService implements IUserService {
	private readonly hashtagService: HashtagService
	private readonly mentorInformationService: MentorInformationService
	private readonly warriorInformationService: WarriorInformationService

	constructor() {
		this.hashtagService = new HashtagService()
		this.mentorInformationService = new MentorInformationService()
		this.warriorInformationService = new WarriorInformationService()
	}

	static async isExists(user_id: number): Promise<boolean> {
		const user = await User.findByPk(user_id)
		return !!user?.get()
	}

	async fetchFullUserById(userId: number): Promise<User | null> {
		const fullUser = await User.findByPk(userId, {
			attributes: { exclude: ['password'] },
			include: [{ model: UserInformation, as: 'user_information' }]
		})

		return fullUser?.get()
	}

	async list(role: string | undefined, pagination: PaginationType): Promise<PaginatedUserResult> {
		const adminRole = await UserRoleService.fetchAdminRole()

		const users = (await User.findAndCountAll(
			paginate(
				{
					where: {
						role_id: role
							? {
								[Op.eq]: role
							}
							: {
								[Op.ne]: adminRole?.get('id')
							}
					},
					attributes: { exclude: ['password'] },
					include: [
						{ model: UserRole, as: 'role' },
						{
							model: UserInformation,
							as: 'user_information',
							attributes: ['profile_url', 'job_role', 'employer_name']
						},
						{ model: MentorInformation, as: 'mentor_information' },
						{ model: WarriorInformation, as: 'warrior_information' }
					]
				},
				pagination
			)
		)) as PaginatedUserResult

		users.rows = users.rows.map(user => user.toJSON())

		users.page = +pagination.page
		users.pageSize = +pagination.pageSize
		return users
	}

	async fetchById(id: number, userId: number): Promise<User> {
		const user = await User.findOne({
			where: {
				id: userId
			},
			attributes: {
				exclude: ['password']
			}
		})

		return user as any
	}

	async fetchByEmail(email: string, userId: number): Promise<User> {
		const user = await User.findOne({
			where: {
				email: email,
				id: userId
			}
		})

		if (!user) {
			throw new Error('Unauthorized')
		}

		return user as any
	}

	static async findByEmail(email: string): Promise<User> {
		const user = await User.findOne({
			where: {
				email: email
			}
		})

		return user as User
	}

	async update(userId: number, params: UserType): Promise<User> {
		await User.update(
			{
				full_name: params.full_name,
				email: params.email,
				default_currency_id: params.default_currency_id,
				user_feature_id: params.user_feature_id
			},
			{
				where: {
					id: userId
				}
			}
		)

		const newUpdatedRow = await User.findByPk(userId, {
			attributes: {
				exclude: ['password']
			}
		})
		return newUpdatedRow as User
	}

	async delete(id: number, userId: number): Promise<number> {
		if (userId !== id) {
			throw new Error('Unauthorized')
		}
		const deletedRow = await User.destroy({
			where: {
				id: userId
			}
		})

		return deletedRow
	}

	getMyInfo = async (userId: number): Promise<null | UserInfo> => {
		let myInfo = (await User.findOne({
			where: { id: userId },
			include: [
				{ model: UserInformation, as: 'user_information' },
				{ model: MentorInformation, as: 'mentor_information' },
				{ model: WarriorInformation, as: 'warrior_information' }
			],
			attributes: { exclude: ['password'] }
		})) as UserInfo

		if (!myInfo) return null

		myInfo = myInfo.get()

		const user_hashtags = await this.hashtagService.fetchById(userId)
		const hashtags = user_hashtags.map(hashtag => hashtag.get())

		myInfo['hashtags'] = hashtags

		if (myInfo?.warrior_information) {
			const warrior_information = myInfo.warrior_information.get({ plain: true })
			myInfo['warrior_information'] = {
				...warrior_information,
				specialty: warrior_information?.specialty.split(','),
				certification: warrior_information?.certification.split(','),
				therapy_type: warrior_information?.therapy_type.split(','),
				price_range: warrior_information?.price_range.split(',')
			}
		}

		myInfo['hashtags'] = hashtags

		return myInfo
	}

	getOtherUserInfo = async (userId: number, otherUserId: number): Promise<OtherUserInfo | null> => {
		const otherUser = await User.findByPk(otherUserId, {
			attributes: { exclude: ['password'] }
		})

		if (!otherUser) {
			const error = new GffError('User not found!')
			error.errorCode = '404'
			throw error
		}

		const user_hashtags = await this.hashtagService.fetchById(otherUserId)

		const hashtags = user_hashtags.map(hashtag => hashtag.get())

		const user_information = await this.getMyInfo(otherUserId)

		const friend_request = await FindFriendModel.findOne({
			where: {
				[Op.or]: [
					{ sender_id: otherUserId, receiver_id: userId },
					{ sender_id: userId, receiver_id: otherUserId }
				]
			},
			include: [
				{
					model: User,
					as: 'sender',
					attributes: USER_FIELDS,
					include: [
						{
							model: UserInformation,
							as: 'user_information',
							attributes: USER_INFORMATION_FIELDS
						}
					]
				},
				{
					model: User,
					as: 'receiver',
					attributes: USER_FIELDS,
					include: [
						{
							model: UserInformation,
							as: 'user_information',
							attributes: USER_INFORMATION_FIELDS
						}
					]
				}
			]
		})

		const mentor_request = await MentorMatcherModel.findOne({
			where: {
				[Op.or]: [
					{ mentor_id: otherUserId, mentee_id: userId },
					{ mentor_id: userId, mentee_id: otherUserId }
				]
			},
			include: [
				{
					model: User,
					as: 'mentee',
					foreignKey: 'mentee_id',
					attributes: USER_FIELDS,
					include: [
						{
							model: UserInformation,
							as: 'user_information',
							attributes: USER_INFORMATION_FIELDS
						}
					]
				},
				{
					model: User,
					as: 'mentor',
					foreignKey: 'mentor_id',
					attributes: USER_FIELDS,
					include: [
						{
							model: UserInformation,
							as: 'user_information',
							attributes: USER_INFORMATION_FIELDS
						}
					]
				}
			]
		})

		const warrior_request = await WellnessWarrior.findOne({
			where: {
				[Op.or]: [
					{ warrior_id: otherUserId, user_id: userId },
					{ warrior_id: userId, user_id: otherUserId }
				]
			},
			include: [
				{
					model: User,
					as: 'user',
					foreignKey: 'user_id',
					attributes: USER_FIELDS,
					include: [
						{
							model: UserInformation,
							as: 'user_information',
							attributes: USER_INFORMATION_FIELDS
						}
					]
				},
				{
					model: User,
					as: 'warrior',
					foreignKey: 'warrior_id',
					attributes: USER_FIELDS,
					include: [
						{
							model: UserInformation,
							as: 'user_information',
							attributes: USER_INFORMATION_FIELDS
						}
					]
				}
			]
		})

		return {
			...otherUser.get(),
			user_information: user_information?.user_information,
			warrior_information: user_information?.warrior_information,
			mentor_information: user_information?.mentor_information,
			friend_request,
			mentor_request,
			warrior_request,
			hashtags
		}
	}

	deactivateUserAccount = async (userId: number): Promise<User> => {
		const user = await User.findByPk(userId)

		if (!user) {
			const error = new GffError('User not found!')
			error.errorCode = '404'
			throw error
		}

		user.set({ deactivated: true });

		return await user.save()
	}
}
