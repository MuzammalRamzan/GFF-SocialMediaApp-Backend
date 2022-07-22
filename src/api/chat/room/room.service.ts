import { IRoomService, RoomParams, RoomType } from './interface'
import { Room } from './room.model'
import { Op } from 'sequelize'

export class RoomService implements IRoomService {
	constructor() { }

	static async isUserBelongToTheRoom(room_id: number, user_id: number): Promise<boolean> {
		const room = await Room.findOne({
			where: { id: room_id }
		})

		if (!room) {
			return false
		}

		const roomObj = room.toJSON() as RoomType

		return roomObj.user_ids.includes(user_id)
	}

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
		const doesRoomExists = await this.doesRoomExist((params.user_ids || []).map(user_id => +user_id));

		if (doesRoomExists) {
			throw new Error('Room already exists')
		}

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

		const user_ids = (room.toJSON() as RoomType).user_ids

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

	async getAllUsersByRoomId(room_id: number): Promise<number[]> {
		const room = await Room.findByPk(room_id, { attributes: ['user_ids'] })

		if (!room) throw new Error("Room doesn't exist")

		return (room.toJSON() as RoomType).user_ids
	}

	async doesRoomExist(user_ids: number[]): Promise<boolean> {
		const totalUserIds = user_ids.length

		if (!totalUserIds || totalUserIds === 1) throw new Error('User ids should be greater than or equal 2.')

		user_ids.sort((a, b) => a - b)

		const room = await Room.findOne({
			where: {
				user_ids: {
					[Op.or]: [
						{ [Op.like]: `%,${user_ids.join(',')}` },
						{ [Op.like]: `${user_ids.join(',')},%` },
						{ [Op.like]: `${user_ids.join(',')}` },
					],
				}
			}
		});

		const roomsByUserId = await this.getAllRooms(user_ids[0])

		let roomExist = false

		for (let roomIdx = 0; roomIdx < roomsByUserId.length; roomIdx++) {
			roomExist = true
			const room = roomsByUserId[roomIdx].toJSON() as RoomType
			const roomUserIdsLength = room.user_ids.length

			for (let userIdx = 1; userIdx < user_ids.length; userIdx++) {
				roomExist = roomExist && totalUserIds === roomUserIdsLength && room.user_ids.includes(user_ids[userIdx])
			}

			if (roomExist) {
				break
			}
		}

		return roomExist
	}
}
