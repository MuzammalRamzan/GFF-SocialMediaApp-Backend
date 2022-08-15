import { Room } from './../chat/room/room.model'
import { ICrewMemberService, CrewMemberType } from './interface'
import { CrewMember } from './crewMemberModel'
import { Crew } from '../crew/crewModel'
import { RoomType } from '../chat/room/interface'
import { CREW_MEMBERS_FIELDS, CREW_MEMBER_USER_FIELD } from '../../helper/db.helper'
import { User } from '../user/userModel'
import { UserRole } from '../user-role/userRoleModel'
import { Op } from 'sequelize/types'

export class CrewMemberService implements ICrewMemberService {
	async add(params: CrewMemberType): Promise<CrewMember> {
		const { crew_id, user_id } = params

		const crewExist = await Crew.findOne({ where: { id: crew_id, is_archived: false } })

		if (!crewExist) {
			throw new Error('CREW NOT FOUND!')
		}

		const isExist = await CrewMember.findOne({
			where: {
				crew_id: crew_id,
				user_id: user_id
			}
		})

		if (isExist) {
			throw new Error('USER ALREADY IN CREW')
		}

		const createCrewMember = await CrewMember.create({
			crew_id,
			user_id
		})

		return createCrewMember
	}

	async list(crewId: any): Promise<Crew[]> {
		const getAllCrewMember =
			// await CrewMember.findAll({ where: { crew_id: crewId } })
			await Crew.findAll({
				where: {
					id: crewId,
					is_archived: false
				},
				include: [
					{
						model: User,
						as: 'created_by',
						attributes: CREW_MEMBER_USER_FIELD,
						include: [
							{
								model: UserRole,
								as: 'role'
							}
						]
					},
					{
						model: CrewMember,
						as: 'crew_members',
						attributes: CREW_MEMBERS_FIELDS,
						include: [
							{
								model: User,
								as: 'user',
								attributes: CREW_MEMBER_USER_FIELD,
								include: [
									{
										model: UserRole,
										as: 'role'
									}
								]
							}
						]
					}
				]
			})
		return getAllCrewMember
	}

	async fetchById(id: number): Promise<CrewMember[]> {
		const getCrewMember = await CrewMember.findAll({
			where: {
				id
			}
		})

		return getCrewMember
	}

	async update(id: number, params: CrewMemberType): Promise<CrewMember> {
		const crew = await CrewMember.findOne({
			where: {
				id
			}
		})

		if (crew) {
			await crew.update(params)
		}

		return crew as CrewMember
	}

	async delete(id: number): Promise<number> {
		const isOwner = await CrewMember.findOne({ where: { id, role: 'owner' } })

		if (isOwner) {
			throw new Error(`Owner can't left from crew!`)
		}

		const deletedRow = await CrewMember.destroy({
			where: {
				id: id
			}
		})

		return deletedRow
	}

	async listCrewRequest(userId: number): Promise<CrewMember[]> {
		const inCrew = await CrewMember.findAll({ where: { user_id: userId, status: 'invited' } })

		let crewIds: any[] = []

		inCrew.map((crew: any) => {
			crewIds.push(crew.crew_id)
		})

		const crewRequests = await Crew.findAll({
			where: { is_archived: false, id: crewIds },
			include: [
				{
					model: User,
					as: 'created_by',
					attributes: CREW_MEMBER_USER_FIELD,
					include: [
						{
							model: UserRole,
							as: 'role'
						}
					]
				},
				{
					model: CrewMember,
					as: 'crew_members',
					attributes: CREW_MEMBERS_FIELDS,
					// where: { user_id: userId, status: 'invited' },
					// required: true,
					include: [
						{
							model: User,
							as: 'user',
							attributes: CREW_MEMBER_USER_FIELD,
							include: [
								{
									model: UserRole,
									as: 'role'
								}
							]
						}
					]
				}
			]
		})

		// const crewRequests = await CrewMember.findAll({ where: { user_id: userId, status: 'invited' } })

		return crewRequests
	}

	async acceptRejectCrewRequest(userId: number, crew_id: number, status: string): Promise<String> {
		const data = await CrewMember.findOne({
			where: {
				user_id: userId,
				crew_id: crew_id,
				status: 'invited'
			}
		})

		let message = ''
		if (data) {
			await data.update({
				status
			})

			if (status === 'accepted') {
				const crew = await Crew.findOne({ where: { id: crew_id, is_archived: false } })
				const roomId = crew?.getDataValue('room_id')
				const roomData = await Room.findByPk(roomId)
				let userIds = roomData?.toJSON().user_ids as RoomType

				let userIdsArray = JSON.parse(JSON.stringify(userIds))
				userIdsArray.push(userId)

				await Room.update(
					{
						user_ids: (userIdsArray || [])?.join(',')
					},
					{ where: { id: roomId } }
				)
			}

			message = `Crew request ${status}`
		} else {
			message = 'Crew Not found!'
		}

		return message
	}
}
