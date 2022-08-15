import { CREW_MEMBER_USER_FIELD } from './../../helper/db.helper'
import { ICrewService, CrewType } from './interface'
import { Crew } from './crewModel'
import { CrewMember } from '../crewMember/crewMemberModel'
import { User } from '../user/userModel'
import { UserRole } from '../user-role/userRoleModel'
import { Room } from '../chat/room/room.model'
import { CREW_MEMBERS_FIELDS } from '../../helper/db.helper'
import { GffError } from '../helper/errorHandler'

export class CrewService implements ICrewService {
	async add(name: string, userId: number, invite_members: number[]): Promise<Crew[]> {
		if (invite_members.length < 3) {
			throw new GffError(`select ${3 - invite_members.length} more users for invite & create crew`, {
				errorCode: '400'
			})
		}

		let isMentor = false
		for (let element of invite_members) {
			const isExist = await User.findOne({ where: { id: element }, include: ['role'] })
			if (isExist) {
				if (isExist.getDataValue('role').name === 'Mentor') isMentor = true
			} else {
				throw new Error('User not found')
			}
		}

		if (isMentor === false) {
			throw new Error('select at least one mentor')
		}

		const createRoom = await Room.create({
			name: name,
			user_ids: ([userId] || [])?.join(',')
		})

		const createCrew = await Crew.create({
			name,
			created_by_id: userId,
			room_id: createRoom.getDataValue('id')
		})

		await CrewMember.create({
			crew_id: createCrew.getDataValue('id'),
			user_id: userId,
			role: 'owner',
			status: 'accepted'
		})

		for (let element of invite_members) {
			await CrewMember.create({
				crew_id: createCrew.getDataValue('id'),
				user_id: +element,
				role: 'member',
				status: 'invited'
			})
		}

		const crew = await this.fetchById(createCrew.getDataValue('id'))
		return crew
	}

	async list(userId: number): Promise<Crew[]> {
		const getAllCrew = await Crew.findAll({
			where: { created_by_id: userId, is_archived: false },
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

		return getAllCrew
	}

	async fetchById(id: number): Promise<Crew[]> {
		const getCrew = await Crew.findAll({
			where: {
				id,
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

		return getCrew
	}

	async update(id: number, params: CrewType): Promise<Crew> {
		const crew = await Crew.findOne({
			where: {
				id
			}
		})

		if (crew) {
			await crew.update(params)
		}

		return crew as Crew
	}

	async delete(id: number, userId: number): Promise<number[]> {
		const archived = await Crew.update({ is_archived: true }, { where: { id } })

		const crew = await Crew.findByPk(id)

		const roomId = crew?.getDataValue('room_id')

		await Room.update(
			{
				user_ids: ([userId] || [])?.join(',')
			},
			{ where: { id: roomId } }
		)

		await CrewMember.destroy({
			where: {
				crew_id: id,
				role: 'member'
			}
		})

		return archived
	}
}
