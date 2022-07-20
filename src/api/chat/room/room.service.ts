import { IRoomService, RoomParams } from './interface'
import { Room } from './room.model'
import { Op } from 'sequelize'

export class RoomService implements IRoomService {
	constructor() {}

	public async getRooms(): Promise<Room[]> {
		return await Room.findAll({})
	}

	public async getRoom(id: string): Promise<Room> {
		const record = await Room.findOne({
			where: { id }
		})

		return record?.get()
	}

	public async createRoom(params: RoomParams): Promise<Room> {
		return await Room.create({
			name: params.name,
			user_ids: (params?.user_ids || [])?.join(',')
		})
	}

	public async joinRoom(room_id: number, user_id: number): Promise<Room> {
		const room = await Room.findOne({
			where: { id: room_id }
		})

		if (!room) {
			throw new Error('Room not found')
		}

		const user_ids = (room.get().user_ids = room
			.get()
			.user_ids.split(',')
			.filter((item: number | string) => !!item)
			.map((item: number | string) => +item))

		if (user_ids.includes(user_id)) {
			return room
		}

		user_ids.push(user_id)

		room.set({
			user_ids: user_ids.join(',')
		})

		await room.save()

		return {
			...room.get(),
			user_ids: user_ids
		}
	}

	static async isUserBelongToTheRoom(room_id: number, user_id: number): Promise<boolean> {
		const room = await Room.findOne({
			where: { id: room_id }
		})

		if (!room) {
			return false
		}

		const user_ids = (room.get().user_ids = room
			.get()
			.user_ids.split(',')
			.filter((item: number | string) => !!item)
			.map((item: number | string) => +item))

		return user_ids.includes(user_id)
	}

	async getAllRooms(user_id: number): Promise<Room[]> {
		return await Room.findAll({
			where: {
				user_ids: {
					[Op.or]: [
						{
							[Op.like]: `%${user_id},%`
						},
						{
							[Op.like]: `%,${user_id}`
						}
					]
				}
			}
		})
	}

	async getAllUsersByRoomId(room_id: number): Promise<string[]> {
		const room = await Room.findByPk(room_id, { attributes: ['user_ids'] })

		if (!room) throw new Error("Room doesn't exist")

		const users: string = room.getDataValue('user_ids')

		return users.split(',')
	}
}
