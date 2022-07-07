import { FindFriendModel, IFriendRequest } from './findFriendModel'
import {
	IFindFriendService,
	RequestStatus,
	RequestType,
	FindFriendRequest,
	FriendUser,
	FriendRequestWithUserInformation
} from './interface'
import { User } from '../user/userModel'
import { Op, where, fn, col } from 'sequelize'
import { UserInformation } from '../user-information/userInformationModel'
import { GffError } from '../helper/errorHandler'
import { Associations } from '../association/association.model'

export class FindFriendService implements IFindFriendService {
	async getFriendRequestsBySenderId(sender_id: number): Promise<FindFriendRequest[]> {
		const findFriends = await FindFriendModel.findAll({
			where: { sender_id: sender_id, status: RequestStatus.SEND, request_type: RequestType.FRIEND },
			include: [
				{
					model: User,
					as: 'receiver',
					identifier: 'receiver_id',
					foreignKey: 'id',
					attributes: ['id', 'full_name'],
					include: [
						{
							model: UserInformation,
							as: 'user_information',
							attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education']
						}
					]
				}
			]
		})

		return findFriends.map(friend => {
			const user = friend.get()

			return {
				id: user.id,
				receiver: user.receiver.get(),
				sender_id: user.sender_id,
				receiver_id: user.receiver_id,
				status: user.status,
				block_reason: user.block_reason,
				request_type: user.request_type
			}
		})
	}

	async getFriendRequestsByReceiverId(receiver_id: number): Promise<FindFriendRequest[]> {
		const findFriends = await FindFriendModel.findAll({
			where: { receiver_id: receiver_id, status: RequestStatus.SEND, request_type: RequestType.FRIEND },
			include: [
				{
					model: User,
					as: 'sender',
					identifier: 'sender_id',
					foreignKey: 'id',
					attributes: ['id', 'full_name'],
					include: [
						{
							model: UserInformation,
							as: 'user_information',
							attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education']
						}
					]
				}
			]
		})

		return findFriends.map(friend => {
			const user = friend.get()
			return {
				id: user.id,
				sender: user.sender.get(),
				sender_id: user.sender_id,
				receiver_id: user.receiver_id,
				status: user.status,
				block_reason: user.block_reason,
				request_type: user.request_type
			}
		})
	}

	async add(sender_id: number, receiver_id: number): Promise<FindFriendModel> {
		const SendRequest = await FindFriendModel.create({
			sender_id: sender_id,
			receiver_id: receiver_id,
			request_type: RequestType.FRIEND
		})

		await Associations.bulkCreate([
			{ user_id: sender_id, find_friend_id: SendRequest.getDataValue('id') },
			{ user_id: receiver_id, find_friend_id: SendRequest.getDataValue('id') }
		])

		return SendRequest as FindFriendModel
	}

	async approve(request_id: number, user_id: number): Promise<FindFriendModel> {
		const findFriend = await FindFriendModel.findOne({
			where: { id: request_id, receiver_id: user_id, status: RequestStatus.SEND, request_type: RequestType.FRIEND }
		})

		if (!findFriend) {
			const error = new GffError('Invalid friend request, you have already approved/reject this request!')
			error.errorCode = '422'
			throw error
		}

		findFriend.set('status', RequestStatus.APPROVE)
		await findFriend.save()

		return findFriend as FindFriendModel
	}

	async reject(request_id: number, user_id: number): Promise<FindFriendModel> {
		const findFriend = await FindFriendModel.findOne({
			where: { id: request_id, receiver_id: user_id, status: RequestStatus.SEND, request_type: RequestType.FRIEND }
		})

		if (!findFriend) {
			const error = new GffError(`Invalid friend request, you have already approved/reject this request!`)
			error.errorCode = '422'
			throw error
		}

		findFriend.set('status', RequestStatus.REJECT)
		await findFriend.save()

		return findFriend as FindFriendModel
	}

	async findBySenderIdAndReceiverId(sender_id: number, receiver_id: number): Promise<IFriendRequest> {
		const findFriend = await FindFriendModel.findOne({
			where: {
				sender_id: sender_id,
				receiver_id: receiver_id,
				request_type: RequestType.FRIEND
			}
		})

		return findFriend?.get()
	}

	async friends(userId: number): Promise<FindFriendRequest[]> {
		const findFriends = await FindFriendModel.findAll({
			where: {
				[Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
				status: RequestStatus.APPROVE,
				request_type: RequestType.FRIEND
			},
			include: [
				{
					model: User,
					as: 'receiver',
					identifier: 'receiver_id',
					foreignKey: 'id',
					attributes: ['id', 'full_name'],
					include: [
						{
							model: UserInformation,
							as: 'user_information',
							attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education']
						}
					]
				},
				{
					model: User,
					as: 'sender',
					identifier: 'sender_id',
					foreignKey: 'id',
					attributes: ['id', 'full_name'],
					include: [
						{
							model: UserInformation,
							as: 'user_information',
							attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education']
						}
					]
				}
			]
		})

		return findFriends.map(friend => {
			const user = friend.get()
			if (user.sender_id === userId) {
				return {
					id: user.id,
					receiver: user.receiver.get(),
					sender_id: user.sender_id,
					receiver_id: user.receiver_id,
					status: user.status,
					request_type: user.request_type
				}
			} else {
				return {
					id: user.id,
					sender: user.sender.get(),
					sender_id: user.sender_id,
					receiver_id: user.receiver_id,
					status: user.status,
					request_type: user.request_type
				}
			}
		})
	}

	async findFriend(searchTerm: string, userId: number): Promise<FriendUser[]> {
		const findFriends = await User.findAll({
			where: {
				[Op.and]: [
					where(fn('lower', col('full_name')), 'LIKE', `%${(searchTerm || '').trim().toLowerCase()}%`),
					{ id: { [Op.ne]: userId } }
				]
			},
			attributes: ['id', 'full_name'],
			include: [
				{
					model: UserInformation,
					as: 'user_information',
					attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education'],
					where: {
						profile_url: {
							[Op.ne]: null
						},
						job_role: {
							[Op.ne]: null
						}
					}
				},
				{
					model: Associations,
					as: 'userAssociations',
					attributes: ['id'],
					include: [
						{
							model: FindFriendModel,
							as: 'findFriendAssociations',
							where: { [Op.or]: [{ sender_id: userId }, { receiver_id: userId }], request_type: RequestType.FRIEND },
							required: true
						}
					]
				}
			]
		})

		const friends: FriendUser[] = []
		for (let i = 0; i < findFriends.length; i++) {
			let friend = findFriends[i].get()
			friend = {
				full_name: friend.full_name,
				id: friend.id,
				user_information: friend?.user_information?.get(),
				userAssociations: friend.userAssociations
			} as FriendUser

			friends.push(friend)
		}

		return friends
	}

	async getFriendRequestById(id: number): Promise<FindFriendRequest> {
		const findFriend = await FindFriendModel.findOne({
			where: {
				id: id,
				request_type: RequestType.FRIEND
			},
			include: [
				{
					model: User,
					as: 'receiver',
					identifier: 'receiver_id',
					foreignKey: 'id',
					attributes: ['id', 'full_name'],
					include: [
						{
							model: UserInformation,
							as: 'user_information',
							attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education']
						}
					]
				},
				{
					model: User,
					as: 'sender',
					identifier: 'sender_id',
					foreignKey: 'id',
					attributes: ['id', 'full_name'],
					include: [
						{
							model: UserInformation,
							as: 'user_information',
							attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education']
						}
					]
				}
			]
		})

		return findFriend?.get()
	}

	async blockFriend(user_id: number, block_user_id: number, reason: string): Promise<FindFriendModel> {
		const request = await FindFriendModel.findOne({
			where: {
				[Op.or]: [
					{ sender_id: user_id, receiver_id: block_user_id },
					{ sender_id: block_user_id, receiver_id: user_id }
				]
			}
		})

		if (request) {
			request.set('request_type', RequestType.BLOCK)
			request.set('block_reason', reason)
			request.set('sender_id', user_id)
			request.set('receiver_id', block_user_id)
			await request.save()
			return request
		} else {
			const newRequest = await FindFriendModel.create({
				sender_id: user_id,
				receiver_id: block_user_id,
				request_type: RequestType.BLOCK,
				block_reason: reason
			})
			return newRequest
		}
	}

	async unblockFriend(user_id: number, unblock_user_id: number): Promise<boolean> {
		const request = await FindFriendModel.destroy({
			where: {
				sender_id: user_id,
				receiver_id: unblock_user_id,
				request_type: RequestType.BLOCK
			}
		})

		return request ? true : false
	}

	async getBlockedFriends(user_id: number): Promise<FindFriendRequest[]> {
		const findFriend = await FindFriendModel.findAll({
			where: {
				sender_id: user_id,
				request_type: RequestType.BLOCK
			},
			include: [
				{
					model: User,
					as: 'receiver',
					identifier: 'receiver_id',
					foreignKey: 'id',
					attributes: ['id', 'full_name'],
					include: [
						{
							model: UserInformation,
							as: 'user_information',
							attributes: [
								'profile_url',
								'bio',
								'date_of_birth',
								'gender',
								'country',
								'job_role',
								'education',
								'user_id'
							]
						}
					]
				}
			]
		})

		return findFriend.map(friend => {
			const user = friend.get()

			return {
				id: user.id,
				blocked_user: user.receiver.get(),
				sender_id: user.sender_id,
				receiver_id: user.receiver_id,
				status: user.status,
				request_type: user.request_type,
				block_reason: user.block_reason
			}
		})
	}

	async getFriendByUserId(loggedInUserId: number, user_id: number): Promise<FriendRequestWithUserInformation> {
		const user = await User.findOne({
			where: {
				id: user_id
			},
			attributes: ['id', 'full_name'],
			include: [
				{
					model: UserInformation,
					as: 'user_information',
					attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education']
				}
			]
		})

		if (!user) {
			const error = new GffError('User not found')
			error.errorCode = '404'
			throw error
		}

		const friendRequest = await FindFriendModel.findOne({
			where: {
				[Op.or]: [
					{ sender_id: loggedInUserId, receiver_id: user_id },
					{ sender_id: user_id, receiver_id: loggedInUserId }
				]
			},
			include: [
				{
					model: User,
					as: 'receiver',
					identifier: 'receiver_id',
					foreignKey: 'id',
					attributes: ['id', 'full_name'],
					include: [
						{
							model: UserInformation,
							as: 'user_information',
							attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education']
						}
					]
				},
				{
					model: User,
					as: 'sender',
					identifier: 'sender_id',
					foreignKey: 'id',
					attributes: ['id', 'full_name'],
					include: [
						{
							model: UserInformation,
							as: 'user_information',
							attributes: ['profile_url', 'bio', 'date_of_birth', 'gender', 'country', 'job_role', 'education']
						}
					]
				}
			]
		})

		const friend_request_data = friendRequest?.get()

		const friend_request =
			friend_request_data.sender_id === loggedInUserId
				? {
						id: friend_request_data.id,
						receiver: friend_request_data.receiver.get(),
						sender_id: friend_request_data.sender_id,
						receiver_id: friend_request_data.receiver_id,
						status: friend_request_data.status,
						request_type: friend_request_data.request_type
				  }
				: {
						id: friend_request_data.id,
						sender: friend_request_data.sender.get(),
						sender_id: friend_request_data.sender_id,
						receiver_id: friend_request_data.receiver_id,
						status: friend_request_data.status,
						request_type: friend_request_data.request_type
				  }

		return {
			user: user.get(),
			friend_request: friend_request
		}
	}

	// is friend
	// is blocked

	async isBlocked(sender_id: number, receiver_id: number): Promise<IFriendRequest> {
		const isBlocked = await FindFriendModel.findOne({
			where: {
				[Op.or]: [
					{ sender_id: sender_id, receiver_id: receiver_id },
					{ sender_id: receiver_id, receiver_id: sender_id }
				],
				request_type: RequestType.BLOCK
			}
		})

		return isBlocked?.get()
	}

	async areUsersFriend(sender_id: number, receiver_id: number): Promise<boolean> {
		const friendRequest = await FindFriendModel.findOne({
			where: {
				[Op.or]: [
					{ sender_id: sender_id, receiver_id: receiver_id },
					{ sender_id: receiver_id, receiver_id: sender_id }
				],
				request_type: RequestType.FRIEND
			}
		})

		return !!friendRequest?.get()
	}
}
