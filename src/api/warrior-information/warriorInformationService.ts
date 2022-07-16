import { GffError } from '../helper/errorHandler'
import { UserInformation } from '../user-information/userInformationModel'
import { UserRoleService } from '../user-role/userRoleService'
import { User } from '../user/userModel'
import { WellnessWarriorService } from '../wellness-warrior/wellnessWarriorService'
import { IWarriorInformationService, IWarriorUser, WarriorInformationParams } from './interface'
import { WarriorInformation } from './warriorInformationModel'

export class WarriorInformationService implements IWarriorInformationService {
	constructor() { }

	private createOrUpdate = async (params: WarriorInformationParams): Promise<WarriorInformation> => {
		const warriorInformation = await WarriorInformation.findOne({
			where: {
				user_id: params.user_id
			}
		})

		const payload = {
			specialty: params.specialty.join(','),
			certification: params.certification.join(','),
			therapy_type: params.therapy_type.join(','),
			price_range: params.price_range.join(',')
		}

		if (warriorInformation) {
			return await warriorInformation.update(payload)
		} else {
			return await WarriorInformation.create({ ...payload, user_id: params.user_id })
		}
	}

	getById = async (user_id: number): Promise<IWarriorUser> => {
		const record = await User.findOne({
			where: {
				id: user_id
			},
			attributes: ['id', 'full_name'],
			include: [
				{
					model: WarriorInformation,
					as: 'warrior_information',
					attributes: ['specialty', 'certification', 'therapy_type', 'price_range']
				},
				{
					model: UserInformation,
					as: 'user_information',
					attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'job_role', 'education']
				}
			]
		})

		if (!record) {
			const error = new GffError('Wellness Warrior information not found!')
			error.errorCode = '404'
			throw error
		}

		const wellness_warrior_request = await WellnessWarriorService.getWarriorRequestByUserId(user_id)

		const user = record?.get()

		return {
			id: user.id,
			full_name: user.full_name,
			user_information: user.user_information,
			warrior_information: {
				specialty: user.warrior_information?.specialty.split(','),
				certification: user.warrior_information?.certification.split(','),
				therapy_type: user.warrior_information?.therapy_type.split(','),
				price_range: user.warrior_information?.price_range.split(',')
			},
			wellness_warrior_request: wellness_warrior_request
		}
	}

	create = async (params: WarriorInformationParams): Promise<WarriorInformation> => {
		const warriorInformation = await this.createOrUpdate(params)

		const warriorRole = await UserRoleService.fetchWellnessWarriorRole()

		await User.update(
			{
				role_id: warriorRole?.get('id')
			},
			{
				where: {
					id: params.user_id
				}
			}
		)

		return warriorInformation.get()
	}

	update = async (params: WarriorInformationParams): Promise<WarriorInformation | null> => {
		const record = await this.createOrUpdate(params)

		return record ? await WarriorInformation.findOne({ where: { user_id: params.user_id } }) : null
	}

	async getAll(): Promise<WarriorInformation[]> {
		const warriors = await WarriorInformation.findAll({
			include: [
				{
					model: User,
					as: 'user',
					attributes: { exclude: ['password'] },
					include: [{ model: UserInformation, as: 'user_information', attributes: ['profile_url'] }]
				}
			]
		})
		return warriors.map(warrior => {
			const warriorInfo = warrior.toJSON()
			let user = warriorInfo['user']
			delete warriorInfo['user']
			user = { ...user, warrior: warriorInfo }
			return user
		})
	}

	static isUserWarrior = async (user_id: number): Promise<boolean> => {
		const warriorRole = await UserRoleService.fetchWellnessWarriorRole()
		const record = await User.findOne({
			where: {
				id: user_id,
				role_id: warriorRole?.get('id')
			}
		})

		return !!record?.get()
	}
}
