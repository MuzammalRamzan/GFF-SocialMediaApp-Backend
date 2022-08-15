import { Request, Response, NextFunction } from 'express'
import { IAuthenticatedRequest } from '../helper/authMiddleware'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { DeleteCrewMemberRequest, GetCrewMemberByUniqueId, UpdateCrewMemberRequest } from './interface'
import { CrewMemberService } from './crewMemberService'
import { validationResult } from 'express-validator'

export class CrewMemberController {
	private readonly crewService: CrewMemberService

	constructor() {
		this.crewService = new CrewMemberService()
	}

	getAllCrewMember = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const crew_id = req.query.crew_id
			const crew = await this.crewService.list(crew_id)
			return res.status(200).send({
				data: { crew: crew[0] },
				code: 200,
				message: 'GET_ALL_CREW_MEMBERS'
			})
		} catch (err) {
			next(err)
		}
	}

	inviteCrewMember = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req).array({ onlyFirstError: true })
			if (errors.length) {
				return res.status(400).json({ errors: errors, message: 'INVALID PARAMS', code: 400 })
			}
			const CrewMember = await this.crewService.add(req.body)
			return res.status(200).send({
				data: {
					CrewMember
				},
				code: 200,
				message: 'CREATE_CREW'
			})
		} catch (err) {
			next(err)
		}
	}

	getCrewMemberById = async (req: GetCrewMemberByUniqueId, res: Response, next: NextFunction) => {
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
			next()
		}
	}

	updateCrewMember = async (req: UpdateCrewMemberRequest, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req).array({ onlyFirstError: true })
			if (errors.length) {
				return res.status(400).json({ errors: errors, message: 'INVALID PARAMS', code: 400 })
			}

			const id = +req.params.id
			const params = req.body

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

	deleteCrewMember = async (req: DeleteCrewMemberRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id

		try {
			const crewData = await this.crewService.fetchById(id)
			if (!crewData.length) {
				throw new Error('CREW_MEMBER_NOT_FOUND')
			}

			await this.crewService.delete(id)
			return res.status(200).send({
				code: 200,
				message: 'DELETE_CREW_MEMBER'
			})
		} catch (err) {
			next(err)
		}
	}

	listOfCrewRequest = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req?.user?.id || 0

			const crewRequest = await this.crewService.listCrewRequest(userId)

			let message = 'FETCH CREW REQUESTS SUCCESSFULLY'

			if (crewRequest.length === 0) {
				message = `YOU DON'T HAVE ANY CREW INVITATION REQUEST`
			}

			return res.status(200).send({
				code: 200,
				data: crewRequest,
				message
			})
		} catch (err) {
			console.log(err)
			next(err)
		}
	}

	acceptOrRejectInvitation = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req?.user?.id || 0
			const { crew_id, status } = req.body

			const errors = validationResult(req).array({ onlyFirstError: true })
			if (errors.length) {
				return res.status(400).json({ errors: errors, message: 'INVALID PARAMS', code: 400 })
			}

			const response = await this.crewService.acceptRejectCrewRequest(userId, crew_id, status)

			return res.status(200).send({
				code: 200,
				message: response
			})
		} catch (err) {
			next(err)
		}
	}
}
