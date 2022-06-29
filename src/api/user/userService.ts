import { QueryTypes } from 'sequelize'
import { sequelize } from '../../database'
import { ISearchUser, IUserService, UserInfo, UserType } from './interface'
import { User } from './userModel'
import { AuthService } from '../auth/authService'
import { Op } from 'sequelize'
import { UserInformationService } from '../user-information/userInformationService'
import { WarriorInformationService } from '../warrior-information/warriorInformationService'
import { MentorInformationService } from '../mentor-information/mentorInformationService'
import { WarriorInformation } from '../warrior-information/warriorInformationModel'
import { UserInformation } from '../user-information/userInformationModel'
import { MentorInformation } from '../mentor-information/mentorInformationModel'

export class UserService implements IUserService {
	private readonly authService: AuthService
	private readonly userInfoService: UserInformationService
	private readonly warriorInfoService: WarriorInformationService
	private readonly mentorInfoService: MentorInformationService

	constructor() {
		this.authService = new AuthService()
		this.userInfoService = new UserInformationService()
		this.warriorInfoService = new WarriorInformationService()
		this.mentorInfoService = new MentorInformationService()
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

	async list(): Promise<User[]> {
		const users = await User.findAll()

		return users
	}

	async fetchById(id: number, userId: number): Promise<User> {
		console.log('USER' + userId, 'ID' + id)
		if (id != userId) {
			throw new Error('Unauthorized')
		}

		const user = await User.findOne({
			where: {
				id: userId
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

	async update(paramsId: number, params: UserType): Promise<User> {
		if (paramsId !== params.id) {
			throw new Error('Unauthorized')
		}
		let passwordHash
		if (params.password) {
			passwordHash = await this.authService.hashPassword(params.password)
		}

		await User.update(
			{
				role_id: params.role_id,
				full_name: params.full_name,
				email: params.email,
				password: passwordHash,
				default_currency_id: params.default_currency_id,
				user_feature_id: params.user_feature_id
			},
			{
				where: {
					id: params.id
				}
			}
		)

		const newUpdatedRow = await User.findByPk(paramsId)
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

	async getMyInfo(userId: number): Promise<null | UserInfo> {
		let myInfo = (await User.findOne({
			where: { id: userId },
			include: [
				{ model: WarriorInformation, as: 'warrior_information' },
				{ model: UserInformation, as: 'user_information' },
				{ model: MentorInformation, as: 'mentor_information' }
			],
			attributes: { exclude: ['password'] }
		})) as UserInfo

		if (!myInfo) return null

		myInfo = myInfo.get()

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

		if (myInfo?.mentor_information) {
			const mentor_information = myInfo.mentor_information.get({ plain: true })
			myInfo['mentor_information'] = {
				...mentor_information,
				industry: (mentor_information.industry || '').split(',').filter((item: string) => !!item),
				role: (mentor_information.role || '').split(',').filter((item: string) => !!item),
				frequency: (mentor_information.frequency || '').split(',').filter((item: string) => !!item),
				conversation_mode: (mentor_information.conversation_mode || '').split(',').filter((item: string) => !!item),
				languages: (mentor_information.languages || '').split(',').filter((item: string) => !!item)
			}
		}

		return myInfo
	}
}
