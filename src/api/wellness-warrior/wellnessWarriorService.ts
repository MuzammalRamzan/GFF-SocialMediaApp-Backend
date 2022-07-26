import { col, fn, Op, where } from 'sequelize'
import { USER_FIELDS, USER_INFORMATION_FIELDS, WELLNESS_WARRIOR_FIELDS } from '../../helper/db.helper'
import { Associations } from '../association/association.model'
import { UserInformation } from '../user-information/userInformationModel'
import { UserRoleService } from '../user-role/userRoleService'
import { User } from '../user/userModel'
import { IWarriorUser } from '../warrior-information/interface'
import { WarriorInformation } from '../warrior-information/warriorInformationModel'
import {
	ISearchWarriorParams,
	IWellnessWarriorRequest,
	IWellnessWarriorService,
	removeWarriorParams,
	RequestType,
	StatusType
} from './interface'
import { WellnessWarrior } from './wellnessWarriorModel'

export class WellnessWarriorService implements IWellnessWarriorService {
	constructor() {}

	private readonly wellness_warrior_relationships = [
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
				},
				{
					model: WarriorInformation,
					as: 'warrior_information',
					attributes: WELLNESS_WARRIOR_FIELDS
				}
			]
		},
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
		}
	]

	private readonly user_information_relation = {
		model: UserInformation,
		as: 'user_information',
		attributes: USER_INFORMATION_FIELDS
	}

	private async getById(id: number): Promise<IWellnessWarriorRequest | null> {
		const record = await WellnessWarrior.findOne({
			where: {
				id
			},
			include: this.wellness_warrior_relationships
		})

		return record ? record.get() : null
	}

	static async getRequestById(id: number): Promise<IWellnessWarriorRequest | null> {
		const record = await WellnessWarrior.findOne({
			where: {
				id
			}
		})

		return record ? record.get() : null
	}

	async searchWellnessWarriors(user_id: number, searchParams: ISearchWarriorParams): Promise<IWarriorUser[]> {
		const warriorRole = await UserRoleService.fetchWellnessWarriorRole()

		const _specialty = searchParams.specialty?.split(',')
		const _certification = searchParams.certification?.split(',')
		const _therapy_type = searchParams.therapy_type?.split(',')
		const _price_range = searchParams.price_range?.split(',')

		const records = await User.findAll({
			where: {
				[Op.and]: [
					{ role_id: warriorRole?.get('id') },
					{ id: { [Op.not]: user_id } },
					where(fn('lower', col('full_name')), 'LIKE', `%${(searchParams.searchTerm || '').trim().toLowerCase()}%`)
				]
			},
			include: [
				{
					model: WarriorInformation,
					as: 'warrior_information',
					attributes: WELLNESS_WARRIOR_FIELDS,
					where: {
						[Op.or]: [
							{
								specialty: {
									[Op.or]: _specialty?.map((specialty: string) => ({
										[Op.like]: `%${specialty.trim()}%`
									}))
								}
							},
							{
								certification: {
									[Op.or]: _certification?.map((certification: string) => ({
										[Op.like]: `%${certification.trim()}%`
									}))
								}
							},
							{
								therapy_type: {
									[Op.or]: _therapy_type?.map((therapy_type: string) => ({
										[Op.like]: `%${therapy_type.trim()}%`
									}))
								}
							},
							{
								price_range: {
									[Op.or]: _price_range?.map((price_range: string) => ({
										[Op.like]: `%${price_range.trim()}%`
									}))
								}
							}
						]
					}
				},
				{
					model: UserInformation,
					as: 'user_information',
					attributes: USER_INFORMATION_FIELDS
				},
				{
					model: Associations,
					as: 'user_associations',
					attributes: ['id'],
					include: [
						{
							model: WellnessWarrior,
							as: 'wellness_warrior_associations',
							where: {
								user_id,
								request_type: RequestType.WARRIOR
							},
							required: true
						}
					]
				}
			]
		})

		return records.map(record => record?.toJSON())
	}

	async isRequestExist(user_id: number, warrior_id: number): Promise<IWellnessWarriorRequest | null> {
		const record = await WellnessWarrior.findOne({
			where: {
				user_id,
				warrior_id,
				request_type: RequestType.WARRIOR
			},
			include: this.wellness_warrior_relationships
		})

		return record?.get()
	}

	async sendRequest(user_id: number, warrior_id: number): Promise<IWellnessWarriorRequest> {
		const record = await WellnessWarrior.create({
			user_id,
			warrior_id
		})

		await Associations.bulkCreate([
			{ user_id: warrior_id, wellness_warrior_id: record.getDataValue('id') },
			{ user_id, wellness_warrior_id: record.getDataValue('id') }
		])

		return record.get()
	}

	async approveRequest(user_id: number, request_id: number): Promise<boolean> {
		const record = await WellnessWarrior.update(
			{
				status: StatusType.APPROVE
			},
			{
				where: {
					warrior_id: user_id,
					id: request_id,
					status: StatusType.SEND,
					request_type: RequestType.WARRIOR
				}
			}
		)

		return !!record[0]
	}

	async rejectRequest(user_id: number, request_id: number): Promise<boolean> {
		const record = await WellnessWarrior.update(
			{
				status: StatusType.REJECT
			},
			{
				where: {
					warrior_id: user_id,
					id: request_id,
					status: StatusType.SEND,
					request_type: RequestType.WARRIOR
				}
			}
		)

		return !!record[0]
	}

	async getRequest(request_id: number): Promise<IWellnessWarriorRequest> {
		const record = await WellnessWarrior.findOne({
			where: {
				id: request_id,
				request_type: RequestType.WARRIOR
			},
			include: this.wellness_warrior_relationships
		})

		return record?.get()
	}

	async getAllRequest(user_id: number): Promise<IWellnessWarriorRequest[]> {
		const records = await WellnessWarrior.findAll({
			where: {
				warrior_id: user_id,
				request_type: RequestType.WARRIOR,
				status: StatusType.SEND
			},
			include: this.wellness_warrior_relationships
		})

		return records.map(record => record.get())
	}

	async getAllSendedRequest(user_id: number): Promise<IWellnessWarriorRequest[]> {
		const records = await WellnessWarrior.findAll({
			where: {
				user_id,
				request_type: RequestType.WARRIOR,
				status: StatusType.SEND
			},
			include: this.wellness_warrior_relationships
		})

		return records.map(record => record.get())
	}

	async isFavoriteExist(user_id: number, warrior_id: number): Promise<IWellnessWarriorRequest | null> {
		const record = await WellnessWarrior.findOne({
			where: {
				user_id,
				warrior_id,
				request_type: RequestType.FAVORITE
			}
		})

		if (record) {
			return await this.getById(record?.get().id)
		} else {
			return null
		}
	}

	async favoriteWarrior(user_id: number, warrior_id: number): Promise<boolean> {
		const record = await WellnessWarrior.create({
			user_id,
			warrior_id,
			request_type: RequestType.FAVORITE
		})

		return !!record
	}

	async unfavoriteWarrior(user_id: number, warrior_id: number): Promise<boolean> {
		const record = await WellnessWarrior.destroy({
			where: {
				user_id,
				warrior_id,
				request_type: RequestType.FAVORITE
			}
		})

		return !!record
	}

	async getAllFavoriteWarrior(user_id: number): Promise<WellnessWarrior[]> {
		const records = await WellnessWarrior.findAll({
			where: {
				user_id,
				request_type: RequestType.FAVORITE
			},
			include: [
				{
					model: User,
					as: 'warrior',
					foreignKey: 'warrior_id',
					attributes: USER_FIELDS,
					include: [this.user_information_relation]
				}
			]
		})

		return records
	}

	static async getWarriorRequestByUserId(userId: number): Promise<IWellnessWarriorRequest | null> {
		const record = await WellnessWarrior.findOne({
			where: {
				user_id: userId,
				request_type: RequestType.WARRIOR
			},
			include: [
				{
					model: User,
					as: 'user',
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

		return record?.get()
	}

	async getMyWarriors(user_id: number): Promise<IWarriorUser[]> {
		const records = await WellnessWarrior.findAll({
			where: {
				[Op.or]: [
					{
						user_id
					},
					{
						warrior_id: user_id
					}
				],
				request_type: RequestType.WARRIOR,
				status: StatusType.APPROVE
			},
			include: this.wellness_warrior_relationships
		})

		return records.map(record => {
			const _record = record.get()
			const user = _record.user
			const warrior = _record.warrior

			return {
				..._record,
				user: _record.warrior_id === user_id ? user : null,
				warrior: _record.user_id === user_id ? warrior : null
			}
		})
	}

	async removeWarrior(request_id: number, params: removeWarriorParams): Promise<number> {
		return await WellnessWarrior.destroy({
			where: { id: request_id, ...(params.user_id ? { user_id: params.user_id } : { warrior_id: params.warrior_id }) }
		})
	}
}
