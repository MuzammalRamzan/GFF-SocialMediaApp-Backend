import { NextFunction, Response } from 'express'
import { IAuthenticatedRequest } from '../helper/authMiddleware'
import { WarriorInformationService } from './warriorInformationService'

export class WarriorInformationController {
	private warriorInformationService: WarriorInformationService

	constructor() {
		this.warriorInformationService = new WarriorInformationService()
	}

	getByUserId = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const userId = +req.params.user_id

			const isExists = await WarriorInformationService.isUserWarrior(userId)

			if (!isExists) {
				return res.status(404).json({
					message: 'User not found',
					code: 404
				})
			}

			const warriorInformation = await this.warriorInformationService.getById(userId)
			return res.status(200).json({
				data: {
					warriorInformation
				},
				message: 'Warrior information retrieved successfully',
				code: 200
			})
		} catch (error) {
			next(error)
		}
	}

	create = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const warriorInformation = await this.warriorInformationService.create(
				Object.assign(req.body, {
					user_id: req?.user?.id
				})
			)
			res.status(200).json({
				data: {
					warriorInformation
				},
				message: 'Warrior information created successfully',
				code: 200
			})
		} catch (err) {
			next(err)
		}
	}

	update = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const warriorInformation = await this.warriorInformationService.update(
				Object.assign(req.body, {
					user_id: req?.user?.id
				})
			)
			res.status(200).json({
				data: {
					warriorInformation
				},
				message: 'Warrior information updated successfully',
				code: 200
			})
		} catch (err) {
			next(err)
		}
	}

	getAllWarriors = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const warriors = await this.warriorInformationService.getAll()
			return res.status(200).json({ data: { warriors }, code: 200, message: 'OK' })
		} catch (err) {
			next(err)
		}
	}
}
