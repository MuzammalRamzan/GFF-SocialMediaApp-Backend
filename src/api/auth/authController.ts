import { Request, Response, NextFunction } from 'express'
import { Messages } from '../../constants/messages'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { AuthService } from './authService'

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
}
