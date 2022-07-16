import { Request, Response, NextFunction } from 'express'
import { PAGE_SIZE } from '../../constants'
import { PaginationType } from '../../helper/db.helper'
import { IAuthenticatedRequest } from '../helper/authMiddleware'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { UserRoleService } from '../user-role/userRoleService'
import {
	DeleteUserRequest,
	GetFullUserByUserIdRequest,
	GetUsersByEmailRequest,
	GetUsersByIdRequest,
	UpdateUserRequest
} from './interface'
import { UserService } from './userService'

const handleError = (err: any, req: IAuthenticatedRequest, res: Response) => {
	const error = err as GffError
	if (error.message === 'Unauthorized') {
		error.errorCode = '401'
		error.httpStatusCode = 401
	} else if (error.message === 'No data found') {
		error.errorCode = '404'
		error.httpStatusCode = 404
	} else if (error?.errorCode) {
		error.httpStatusCode = +error.errorCode
	} else {
		error.errorCode = '500'
		error.httpStatusCode = 500
	}
	return jsonErrorHandler(error, req, res, () => {})
}
export class UserController {
	private readonly userService: UserService
	private readonly roleService: UserRoleService

	constructor() {
		this.userService = new UserService()
		this.roleService = new UserRoleService()
	}

	getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const roleQuery = req.query.role as string

			const pagination: PaginationType = {
				page: +(req.query.page || 0) as number,
				pageSize: +(req.query.pageSize || PAGE_SIZE) as number
			}

			const users = await this.userService.list(roleQuery, pagination)
			if (!users) {
				throw new Error('No data found')
			}
			return res.status(200).send({
				data: {
					users
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			} else if (error.message === 'No data found') {
				error.errorCode = '404'
				error.httpStatusCode = 404
			} else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	// deprecated, please don't use this function.
	getUsersById = async (req: GetUsersByIdRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const userId = +req.user.id

		try {
			const users = await this.userService.fetchById(id, userId)
			if (!users) {
				throw new Error('No data found')
			}
			return res.status(200).send({
				data: {
					users
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			} else if (error.message === 'No data found') {
				error.errorCode = '404'
				error.httpStatusCode = 404
			} else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	getFullUserByUserId = async (req: GetFullUserByUserIdRequest, res: Response, next: NextFunction) => {
		const userId = +req.user.id
		try {
			const fullUser = await this.userService.fetchFullUserById(userId)
			if (!fullUser.length) {
				throw new Error('No data found')
			}
			return res.status(200).send({
				data: {
					fullUser
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			} else if (error.message === 'No data found') {
				error.errorCode = '404'
				error.httpStatusCode = 404
			} else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	getUsersByEmail = async (req: GetUsersByEmailRequest, res: Response, next: NextFunction) => {
		const email = req.params.email
		const userId = +req.user.id
		try {
			const users = await this.userService.fetchByEmail(email, userId)
			if (!users) {
				throw new Error('No data found')
			}
			return res.status(200).send({
				data: {
					users
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			} else if (error.message === 'No data found') {
				error.errorCode = '404'
				error.httpStatusCode = 404
			} else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	updateUser = async (req: UpdateUserRequest, res: Response, next: NextFunction) => {
		const userId = +req.user.id

		try {
			const user = await this.userService.update(userId, req.body)
			return res.status(200).send({
				data: {
					user
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			} else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	deleteUser = async (req: DeleteUserRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const userId = +req.user.id
		try {
			const user = await this.userService.delete(id, userId)
			return res.status(200).send({
				data: {
					user
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			} else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	searchFriend = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		const search = req.query.search as string
		const userId = req?.user?.id as number
		try {
			const users = await this.userService.searchFriend(search, userId)
			if (!users.length) {
				throw new Error('No data found')
			}
			return res.status(200).send({
				data: {
					users
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			} else if (error.message === 'No data found') {
				error.errorCode = '404'
				error.httpStatusCode = 404
			} else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	getMyInfo = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req?.user?.id as number
			const userInfo = await this.userService.getMyInfo(userId)
			return res.status(200).json({ data: { ...userInfo }, message: 'OK', code: 200 })
		} catch (err) {
			return handleError(err, req, res)
		}
	}

	getUserDetailsById = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req.user?.id as number
			const otherUserId = +req.params.id
			const otherUserInfo = await this.userService.getOtherUserInfo(userId, otherUserId)
			return res.status(200).json({ data: { ...otherUserInfo }, message: 'OK', code: 200 })
		} catch (err) {
			return handleError(err, req, res)
		}
	}
}
