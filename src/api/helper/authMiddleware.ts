import { Request, Response, NextFunction } from 'express'
import { Messages } from '../../constants/messages'
import { AuthService } from '../auth/authService'
import { IUser } from '../user/userModel'
import { UserService } from '../user/userService'

export interface IAuthenticatedRequest extends Request {
	user?: IUser
}

export const authMiddleware = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
	try {
		const token = req.headers['auth-token'] as string

		const decodedToken = AuthService.verifyJwtToken(token) as any

		const user = await UserService.findByEmail(decodedToken.email)

		if (!user) {
			throw new Error('User not found!')
		}

		if (user.getDataValue('deactivated')) {
			console.log(new Error(Messages.ACCOUNT_DEACTIVATED))
			return res.status(401).send({ message: Messages.ACCOUNT_DEACTIVATED, status: 401 })
		}

		req.user = user.get()
		return next()
	} catch (error) {
		console.log(error)
		res.status(401).send({ message: 'Unauthorized', status: 401 })
	}
}
