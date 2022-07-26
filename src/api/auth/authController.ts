import { Request, Response, NextFunction } from 'express'
import { Messages } from '../../constants/messages'
import { IAuthenticatedRequest } from '../helper/authMiddleware'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { UserRoleService } from '../user-role/userRoleService'
import { AuthService } from './authService'
import { resetPasswordBodyType } from './interface'

export class AuthController {
	private readonly authService: AuthService

	constructor() {
		this.authService = new AuthService()
	}

	signUp = async (req: Request, res: Response, next: NextFunction) => {
		const email = req.body.email
		const pass = req.body.password
		const fullName = req.body.full_name
		try {
			const user = await this.authService.createUser(email, fullName, pass)
			return res.status(200).send({
				data: {
					user
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			error.errorCode = '400'
			error.httpStatusCode = 400
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	logIn = async (req: Request, res: Response, next: NextFunction) => {
		const email = req.body.email
		const password = req.body.password
		try {
			const user = await this.authService.checkCreds(email, password)

			if (user?.deactivated) {
				const err = new GffError(Messages.ACCOUNT_DEACTIVATED)
				err.errorCode = '401'
				err.httpStatusCode = +err.errorCode
				throw err
			}

			const token = this.authService.generateJwtToken(user!.email, user!.password)

			res.set('auth-token', token)

			return res.status(200).send({
				data: {
					user,
					token
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (!error?.errorCode) {
				error.errorCode = '404'
			}
			if (!error?.httpStatusCode) {
				error.httpStatusCode = 404
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	adminLogIn = async (req: Request, res: Response, next: NextFunction) => {
		const email = req.body.email
		const password = req.body.password
		try {
			const user = await this.authService.checkCreds(email, password)

			const adminRole = await UserRoleService.fetchAdminRole()

			if (user?.role_id !== adminRole?.get('id')) {
				const err = new GffError('User not found!')
				err.errorCode = '404'
				err.httpStatusCode = 404
				throw err
			}

			const token = this.authService.generateJwtToken(user!.email, user!.password)

			res.set('auth-token', token)

			return res.status(200).send({
				data: {
					user,
					token
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (!error?.errorCode) {
				error.errorCode = '404'
			}
			if (!error?.httpStatusCode) {
				error.httpStatusCode = 404
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	resetPassword = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const user = req.user
			const body = req.body as resetPasswordBodyType

			if (body.newPassword === body.password)
				throw new GffError('Both old and new password can not be same!', { errorCode: '403' })

			if (!user?.email) throw new GffError('User email not found!', { errorCode: '404' })

			const isAuthenticatedUser = await this.authService.checkCreds(user?.email, body.password)

			if (!isAuthenticatedUser) throw new GffError('Wrong username or password!', { errorCode: '403' })

			await this.authService.updatePassword(user.id, body.newPassword)

			return res.status(200).json({ data: {}, message: 'Password has been updated!', code: 200 })
		} catch (error) {
			next(error)
		}
	}
}
