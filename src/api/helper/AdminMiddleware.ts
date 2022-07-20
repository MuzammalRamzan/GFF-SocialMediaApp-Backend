import { NextFunction, Response } from 'express'
import { UserRoleService } from '../user-role/userRoleService'
import { IAuthenticatedRequest } from './authMiddleware'

export const adminMiddleware = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
	try {
		const adminRole = await UserRoleService.fetchAdminRole()

		if (req.user?.role_id !== adminRole?.getDataValue('id')) {
			throw new Error('Unauthorized')
		}
		return next();
	} catch (error) {
		console.log(error)
		res.status(401).send({ message: 'Unauthorized', status: 401 })
	}
}
