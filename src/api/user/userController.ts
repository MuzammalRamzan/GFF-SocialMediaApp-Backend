import { Console } from 'console'
import { Request, Response, NextFunction } from 'express'
import { IAuthenticatedRequest } from '../helper/authMiddleware'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import {
	DeleteUserRequest,
	GetFullUserByUserIdRequest,
	GetUsersByEmailRequest,
	GetUsersByIdRequest,
	UpdateUserRequest
} from './interface'
import { UserService } from './userService'

export class UserController {
	private readonly userService: UserService

	constructor() {
		this.userService = new UserService()
	}

	getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const users = await this.userService.list()
			res.send(users)
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	getUsersById = async (req: GetUsersByIdRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const userId = +req.user.id

		try {
			const users = await this.userService.fetchById(id, userId)
			res.send(users)
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	getFullUserByUserId = async (req: GetFullUserByUserIdRequest, res: Response, next: NextFunction) => {
		const userId = +req.user.id
		try {
			const fullUser = await this.userService.fetchFullUserById(userId)
			res.status(200).send(fullUser)
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	getUsersByEmail = async (req: GetUsersByEmailRequest, res: Response, next: NextFunction) => {
		const email = req.params.email
		const userId = +req.user.id
		try {
			const users = await this.userService.fetchByEmail(email, userId)
			res.send(users)
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	updateUser = async (req: UpdateUserRequest, res: Response, next: NextFunction) => {
		const paramsId = +req.params.id
		const id = +req.user.id
		const params = { ...req.body, id }

		try {
			const user = await this.userService.update(paramsId, params)
			res.send(user)
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	deleteUser = async (req: DeleteUserRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const userId = +req.user.id
		try {
			const user = await this.userService.delete(id, userId)
			res.send({ user })
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	searchFriend = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		const search = req.query.search as string
		const userId = req?.user?.id as number
		try {
			const users = await this.userService.searchFriend(search, userId)
			res.status(200).send(users)
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			return jsonErrorHandler(err, req, res, () => {})
		}
	}
}