import { QueryTypes } from 'sequelize'
import { sequelize } from '../../database'
import { ISearchUser, IUserService, UserInfoType, UserType } from './interface'
import { User } from './userModel'
import { AuthService } from '../auth/authService'
import { Op } from 'sequelize'
import { UserInformationService } from '../user-information/userInformationService'
import { WarriorInformationService } from '../warrior-information/warriorInformationService'
import { MentorInformationService } from '../mentor-information/mentorInformationService'

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

	async getMyInfo(userId: number): Promise<UserInfoType> {
		const user = await this.fetchById(userId, userId)
		user.setDataValue('password', '')
		const userInformation = await this.userInfoService.fetchById(userId, userId)
		const warriorInformation = (await this.warriorInfoService.getById(userId)).warrior_information

		const mentorInformation = await this.mentorInfoService.getMentorInfo(userId)

		return { user, userInformation, warriorInformation, mentorInformation } as UserInfoType
	}
}
