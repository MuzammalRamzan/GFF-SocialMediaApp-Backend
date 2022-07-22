import { NextFunction, Response } from 'express'
import { validationResult } from 'express-validator'
import { RoomService } from '../chat/room/room.service'
import { IAuthenticatedRequest } from '../helper/authMiddleware'
import { WarriorInformationService } from '../warrior-information/warriorInformationService'
import { WellnessWarriorService } from './wellnessWarriorService'

export class WellnessWarriorController {
	private wellnessWarriorService: WellnessWarriorService
	private readonly roomService: RoomService

	constructor() {
		this.wellnessWarriorService = new WellnessWarriorService()
		this.roomService = new RoomService()
	}

	public searchWellnessWarriors = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const user_id = req?.user?.id as number
			const wellnessWarriors = await this.wellnessWarriorService.searchWellnessWarriors(user_id, req.query as any)

			return res.status(200).json({
				data: {
					wellnessWarriors
				},
				message: 'Get Wellness Warriors successfully!',
				code: 200
			})
		} catch (err) {
			next(err)
		}
	}

	public sendRequest = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req).array({ onlyFirstError: true })
			if (errors.length) {
				return res.status(400).json({ errors: errors, message: 'Validation error', code: 400 })
			}

			const user_id = req?.user?.id as number
			const wellnessWarrior_id = req.body.warrior_id as number

			if (user_id === wellnessWarrior_id) {
				return res.status(400).json({ message: 'You can not send request to yourself', code: 400 })
			}

			const isUserWarrior = await WarriorInformationService.isUserWarrior(wellnessWarrior_id)
			if (!isUserWarrior) {
				return res.status(400).json({ message: 'This user is not a wellness warrior', code: 400 })
			}

			const isExist = await this.wellnessWarriorService.isRequestExist(user_id, wellnessWarrior_id)

			if (isExist) {
				return res.status(400).json({
					data: {
						request: isExist
					},
					message: 'You have already sent request to this wellness warrior!',
					code: 400
				})
			}

			const request = await this.wellnessWarriorService.sendRequest(user_id, wellnessWarrior_id)

			return res.status(200).json({
				data: {
					request
				},
				message: 'Send request successfully!',
				code: 200
			})
		} catch (err) {
			next(err)
		}
	}

	public approveRequest = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req).array({ onlyFirstError: true })
			if (errors.length) {
				return res.status(400).json({ errors: errors, message: 'Validation error', code: 400 })
			}

			const user_id = req?.user?.id as number
			const request_id = req.body.request_id as number

			const isExist = (await WellnessWarriorService.getRequestById(request_id)) as any

			if (!isExist) {
				return res.status(400).json({
					data: {},
					message: 'Request not found!',
					code: 400
				})
			}

			const request = await this.wellnessWarriorService.approveRequest(user_id, request_id)

			if (request) {
				const wellness_warrior = await this.wellnessWarriorService.getRequest(request_id)

				const users = [wellness_warrior.user_id, wellness_warrior.warrior_id]

				const doesRoomExist = await this.roomService.doesRoomExist(users)
				if (!doesRoomExist) {
					await this.roomService.createRoom({
						name: `Chat between ${users.join(' and ')}`,
						user_ids: users.map(id => `${id}`)
					})
				}
			}

			return res.status(200).json({
				data: {
					request
				},
				message: request ? 'Approve request successfully!' : 'Request not found!',
				code: 200
			})
		} catch (err) {
			next(err)
		}
	}

	public rejectRequest = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req).array({ onlyFirstError: true })
			if (errors.length) {
				return res.status(400).json({ errors: errors, message: 'Validation error', code: 400 })
			}

			const user_id = req?.user?.id as number
			const request_id = req.body.request_id as number

			const isExist = (await WellnessWarriorService.getRequestById(request_id)) as any

			if (!isExist) {
				return res.status(400).json({
					data: {},
					message: 'Request not found!',
					code: 400
				})
			}

			const request = await this.wellnessWarriorService.rejectRequest(user_id, request_id)

			return res.status(200).json({
				data: {
					request
				},
				message: request ? 'Reject request successfully!' : 'Request not found!',
				code: 200
			})
		} catch (err) {
			next(err)
		}
	}

	public getRequest = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const request_id = +req.params.request_id as number

			const request = await this.wellnessWarriorService.getRequest(request_id)

			if (!request) {
				return res.status(404).json({
					data: {},
					message: 'Request not found!',
					code: 404
				})
			}

			return res.status(200).json({
				data: {
					request
				},
				message: 'Get request successfully!',
				code: 200
			})
		} catch (err) {
			next(err)
		}
	}

	public getAllRequests = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const user_id = req?.user?.id as number

			const requests = await this.wellnessWarriorService.getAllRequest(user_id)

			return res.status(200).json({
				data: {
					requests
				},
				message: 'Get requests successfully!',
				code: 200
			})
		} catch (err) {
			next(err)
		}
	}

	public getAllSendedRequests = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const user_id = req?.user?.id as number

			const requests = await this.wellnessWarriorService.getAllSendedRequest(user_id)

			return res.status(200).json({
				data: {
					requests
				},
				message: 'Get requests successfully!',
				code: 200
			})
		} catch (err) {
			next(err)
		}
	}

	public favoriteWellnessWarrior = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req).array({ onlyFirstError: true })
			if (errors.length) {
				return res.status(400).json({ errors: errors, message: 'Validation error', code: 400 })
			}

			const user_id = req?.user?.id as number
			const wellnessWarrior_id = req.body.warrior_id as number

			if (user_id === wellnessWarrior_id) {
				return res.status(400).json({
					data: {},
					message: "You can't favorite yourself!",
					code: 400
				})
			}

			const isUserWarrior = await WarriorInformationService.isUserWarrior(wellnessWarrior_id)
			if (!isUserWarrior) {
				return res.status(400).json({ message: 'This user is not a wellness warrior', code: 400 })
			}

			const isExist = await this.wellnessWarriorService.isFavoriteExist(user_id, wellnessWarrior_id)

			if (isExist) {
				return res.status(400).json({
					data: {
						favorite: isExist
					},
					message: 'You have already favorite this wellness warrior!',
					code: 400
				})
			}

			const favorite = await this.wellnessWarriorService.favoriteWarrior(user_id, wellnessWarrior_id)

			return res.status(200).json({
				data: {
					favorite
				},
				message: 'Favorite wellness warrior successfully!',
				code: 200
			})
		} catch (err) {
			next(err)
		}
	}

	public unfavoriteWellnessWarrior = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req).array({ onlyFirstError: true })
			if (errors.length) {
				return res.status(400).json({ errors: errors, message: 'Validation error', code: 400 })
			}

			const user_id = req?.user?.id as number
			const wellnessWarrior_id = req.body.warrior_id as number

			if (user_id === wellnessWarrior_id) {
				return res.status(400).json({
					data: {},
					message: "You can't unfavorite yourself!",
					code: 400
				})
			}

			const isUserWarrior = await WarriorInformationService.isUserWarrior(wellnessWarrior_id)
			if (!isUserWarrior) {
				return res.status(400).json({ message: 'This user is not a wellness warrior', code: 400 })
			}

			const favorite = await this.wellnessWarriorService.unfavoriteWarrior(user_id, wellnessWarrior_id)

			return res.status(200).json({
				data: {
					favorite
				},
				message: 'Unfavorite wellness warrior successfully!',
				code: 200
			})
		} catch (err) {
			next(err)
		}
	}

	public getFavoriteWellnessWarriors = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const user_id = req?.user?.id as number

			const wellnessWarriors = await this.wellnessWarriorService.getAllFavoriteWarrior(user_id)

			return res.status(200).json({
				data: {
					wellnessWarriors
				},
				message: 'Get wellness warriors successfully!',
				code: 200
			})
		} catch (err) {
			next(err)
		}
	}

	public getMyWarriors = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const user_id = req?.user?.id as number

			const wellnessWarriors = await this.wellnessWarriorService.getMyWarriors(user_id)

			return res.status(200).json({
				data: {
					wellnessWarriors
				},
				message: 'Get wellness warriors successfully!',
				code: 200
			})
		} catch (err) {
			next(err)
		}
	}
}
