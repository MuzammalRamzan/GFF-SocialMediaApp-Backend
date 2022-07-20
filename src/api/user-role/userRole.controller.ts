import { Request, Response, NextFunction } from 'express'
import { UserRoleService } from './userRoleService'

export class UserRoleController {
	private readonly userRoleService: UserRoleService

	constructor() {
		this.userRoleService = new UserRoleService()
	}

	getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const roles = await this.userRoleService.getAllRoles()
			return res.status(200).json({ data: { roles }, code: 200, message: 'OK' })
		} catch (err) {
			next(err)
		}
	}
}
