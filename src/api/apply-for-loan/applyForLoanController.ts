import { Response, NextFunction, Request } from 'express'
import { IAuthenticatedRequest } from '../helper/authMiddleware'

import { ApplyForLoanService } from './applyForLoanService'

export class ApplyForLoanController {
	private readonly applyForLoanService: ApplyForLoanService

	constructor() {
		this.applyForLoanService = new ApplyForLoanService()
	}

	checkEligibleForLoan = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req?.user?.id as number
			const checkEligibleForLoan = await this.applyForLoanService.checkEligibleForLoan(userId)
			return res.status(200).send({
				data: {
					checkEligibleForLoan
				},
				code: 200,
				message: 'OK'
			})
		} catch (error) {
			next(error)
		}
	}

	applyForLoan = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req?.user?.id as number

			const applyForLoan = await this.applyForLoanService.applyForLoan(userId, req?.body)
			return res.status(200).send({
				data: {
					applyForLoan
				},
				code: 200,
				message: 'OK'
			})
		} catch (error) {
			next(error)
		}
	}

	getLoans = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const userId = req?.user?.id as number
			const roleId = req?.user?.role_id as number

			const loans = await this.applyForLoanService.loans(userId, roleId)
			return res.status(200).send({
				data: {
					loans
				},
				code: 200,
				message: 'OK'
			})
		} catch (error) {
			next(error)
		}
	}
}
