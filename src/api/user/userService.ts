import { QueryTypes } from 'sequelize'
import { sequelize } from '../../database'
import { ISearchUser, IUserService, OtherUserInfo, UserInfo, UserType } from './interface'
import { User } from './userModel'
import { AuthService } from '../auth/authService'
import { Op } from 'sequelize'
import { WarriorInformation } from '../warrior-information/warriorInformationModel'
import { UserInformation } from '../user-information/userInformationModel'
import { MentorInformation } from '../mentor-information/mentorInformationModel'
import { WellnessWarrior } from '../wellness-warrior/wellnessWarriorModel'
import { MentorMatcherModel } from '../mentor-matcher/mentorMatcherModel'
import { GffError } from '../helper/errorHandler'
import { FindFriendModel } from '../find-friend/findFriendModel'
import { USER_FIELDS, USER_INFORMATION_FIELDS } from '../../helper/db.helper'
import { HashtagService } from '../hashtag/hashtagService'
import { UserRole } from '../user-role/userRoleModel'

export class UserService implements IUserService {
	private readonly hashtagService: HashtagService

	constructor() {
		this.hashtagService = new HashtagService()
	}

	static async isExists(user_id: number): Promise<boolean> {
		const user = await User.findByPk(user_id)
		return !!user?.get()
	}

	async fetchFullUserById(userId: number): Promise<User[]> {
		const fullUser = await sequelize.query(
			'SELECT * FROM `user_information` INNER JOIN `user` ON user_information.user_id = user.id WHERE user_id=' +
				userId,
			{ type: QueryTypes.SELECT }
		)

		return fullUser as User[]
	}

	async list(role: string | undefined): Promise<UserInfo[]> {
		const users = (await User.findAll({
			where: { ...(role ? { role_id: role } : {}) },
			attributes: { exclude: ['password'] },
			include: [
				{ model: UserRole, as: 'role' },
				{ model: UserInformation, as: 'user_information', attributes: ['profile_url'] },
				{ model: MentorInformation, as: 'mentor_information' },
				{ model: WarriorInformation, as: 'warrior_information' }
			]
		})) as UserInfo[]

		return users.map(user => {
			const userInfo: UserInfo = user.get()

			if (userInfo?.mentor_information) {
				userInfo['mentor_information'] = this.parseMentorInformation(userInfo.mentor_information)
			}

			if (userInfo?.warrior_information) {
				userInfo['warrior_information'] = this.parseWarriorInformation(userInfo.warrior_information)
			}

			return userInfo
		})
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

	async searchFriend(searchTerm: string, userId: number): Promise<ISearchUser[]> {
		const user = await User.findAll({
			where: {
				[Op.or]: [
					{
						firstname: {
							[Op.like]: `%${searchTerm}%`
						}
					},
					{
						lastname: {
							[Op.like]: `%${searchTerm}%`
						}
					}
				],
				id: {
					[Op.ne]: userId
				}
			}
		})

		return user.map(user => {
			const data = user.get()
			return {
				id: data.id,
				firstname: data.firstname,
				lastname: data.lastname
			}
		})
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
			myInfo['warrior_information'] = this.parseWarriorInformation(myInfo.warrior_information)
		}

		if (myInfo?.mentor_information) {
			myInfo['mentor_information'] = this.parseMentorInformation(myInfo.mentor_information)
		}

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

	private parseMentorInformation = (mentor: MentorInformation) => {
		const mentor_information = mentor.toJSON()
		return {
			...mentor_information,
			industry: (mentor_information.industry || '').split(',').filter((item: string) => !!item),
			role: (mentor_information.role || '').split(',').filter((item: string) => !!item),
			frequency: (mentor_information.frequency || '').split(',').filter((item: string) => !!item),
			conversation_mode: (mentor_information.conversation_mode || '').split(',').filter((item: string) => !!item),
			languages: (mentor_information.languages || '').split(',').filter((item: string) => !!item)
		}
	}

	private parseWarriorInformation = (warrior: WarriorInformation) => {
		const warrior_information = warrior.toJSON()
		return {
			...warrior_information,
			specialty: warrior_information?.specialty.split(','),
			certification: warrior_information?.certification.split(','),
			therapy_type: warrior_information?.therapy_type.split(','),
			price_range: warrior_information?.price_range.split(',')
		}
	}
}
