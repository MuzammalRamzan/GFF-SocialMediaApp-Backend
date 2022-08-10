import { Response, NextFunction } from 'express'
import { IAuthenticatedRequest } from '../helper/authMiddleware'
import { DashboardServices } from './dashboard.services'

export class DashboardController {
	private readonly dashboardServices: DashboardServices

	constructor() {
		this.dashboardServices = new DashboardServices()
	}

	getTransactionStatistics = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req.user?.id as number
			const default_currency_id = req.user?.default_currency_id as number

			const chart = await this.dashboardServices.getTransactionStatistics(userId, default_currency_id)
			return res.status(200).json({ data: { chart }, code: 200, message: 'OK' })
		} catch (error) {
			next(error)
		}
	}

	getTransactionInformation = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req.user?.id as number

			const data = await this.dashboardServices.getTransactionInformation(userId)
			return res.status(200).json({ data, code: 200, message: 'OK' })
		} catch (error) {
			next(error)
		}
	}
}
