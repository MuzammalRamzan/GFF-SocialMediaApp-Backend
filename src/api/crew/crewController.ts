import { Request, Response, NextFunction } from 'express'
import { IAuthenticatedRequest } from '../helper/authMiddleware'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { GetCrewByUniqueId, UpdateCrewRequest } from './interface'
import { CrewService } from './crewService'

export class CrewController {
	private readonly crewService: CrewService

	constructor() {
		this.crewService = new CrewService()
	}

	getAllCrew = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req?.user?.id || 0

			const crew = await this.crewService.list(userId)
			return res.status(200).send({
				data: {
					crew
				},
				code: 200,
				message: 'GET_ALL_CREW'
			})
		} catch (err) {
			next(err)
		}
	}

	createCrew = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		const name = req.body.name
		const invite_members = req.body.invite_members || []
		const userId = req?.user?.id || 0
		try {
			const crew = await this.crewService.add(name, userId, invite_members)
			return res.status(200).send({
				data: {
					crew: crew[0]
				},
				code: 200,
				message: 'CREATE_CREW'
			})
		} catch (err) {
			next(err)
		}
	}

	getCrewById = async (req: GetCrewByUniqueId, res: Response, next: NextFunction) => {
		const id = +req.params.id

		try {
			const crewData = await this.crewService.fetchById(id)
			if (!crewData.length) {
				throw new Error('CREW_NOT_FOUND')
			}

			const crew = crewData[0]
			return res.status(200).send({
				data: {
					crew
				},
				code: 200,
				message: 'GET_CREW'
			})
		} catch (err) {
			next(err)
		}
	}

	updateCrew = async (req: UpdateCrewRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const params = req.body

		try {
			const crewData = await this.crewService.fetchById(id)
			if (!crewData.length) {
				throw new Error('CREW_NOT_FOUND')
			}

			const crew = await this.crewService.update(id, params)
			return res.status(200).send({
				data: {
					crew
				},
				code: 200,
				message: 'UPDATE_CREW'
			})
		} catch (err) {
			next(err)
		}
	}

	deleteCrew = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const userId = req?.user?.id || 0

		try {
			const crewData = await this.crewService.fetchById(id)
			if (!crewData.length) {
				throw new Error('CREW_NOT_FOUND')
			}

			if (crewData[0].getDataValue('created_by_id') !== userId) {
				throw new Error(`YOU DON'T HAVE ANY RIGHTS TO DELETE THIS CREW`)
			}

			await this.crewService.delete(id, userId)
			return res.status(200).send({
				code: 200,
				message: 'DELETE_CREW'
			})
		} catch (err) {
			next(err)
		}
	}
}
