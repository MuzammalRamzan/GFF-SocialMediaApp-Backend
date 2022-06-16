import { Response, NextFunction } from 'express'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import {
	CreateUserInformationRequest,
	DeleteUserInformationRequest,
	GetUserInformationByUserIdRequest,
	UpdateUserInformationRequest
} from './interface'
import { UserInformationService } from './userInformationService'

export class UserInformationController {
	private readonly userInformationService: UserInformationService

	constructor() {
		this.userInformationService = new UserInformationService()
	}

	createUserInformation = async (req: CreateUserInformationRequest, res: Response, next: NextFunction) => {
		const user_id = +req.user.id
		const params = { ...req.body, user_id }
		try {
			const userInformation = await this.userInformationService.add(params)
			return res.status(200).send({
				data: {
					userInformation
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'User information already exists') {
				error.errorCode = '409'
				error.httpStatusCode = 409
			}
			else if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			}
			else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	getUserInformationByUserId = async (req: GetUserInformationByUserIdRequest, res: Response, next: NextFunction) => {
		const params_user_id = +req.params.user_id
		const userId = +req.user.id

		try {
			const userInformation = await this.userInformationService.fetchById(params_user_id, userId)
			if(!userInformation) {
				throw new Error('No data found')
			}
			return res.status(200).send({
				data: {
					userInformation
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			}
			else if  (error.message === 'No data found') {
				error.errorCode = '404'
				error.httpStatusCode = 404
			}
			else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	updateUserInformation = async (req: UpdateUserInformationRequest, res: Response, next: NextFunction) => {
		const userId = +req.params.user_id
		const user_id = +req.user.id
		const params = { ...req.body, user_id }
		try {
			const userInformation = await this.userInformationService.update(userId, params)
			return res.status(200).send({
				data: {
					userInformation
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			}
			else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	deleteUserInformation = async (req: DeleteUserInformationRequest, res: Response, next: NextFunction) => {
		const params_user_id = +req.params.user_id
		const userId = +req.user.id
		try {
			const userInformation = await this.userInformationService.delete(params_user_id, userId)
			return res.status(200).send({
				data: {
					userInformation
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			}
			else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}
}
