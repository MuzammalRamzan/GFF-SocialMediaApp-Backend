import { Response, NextFunction, Request } from 'express'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import {
	DeleteLoanLedgerPersonalInfoRequest,
	GetLoanLedgerPersonalInfoByIdRequest,
	GetLoanLedgerPersonalInfoByUserIdRequest,
	UpdateLoanLedgerPersonalInfoRequest
} from './interface'
import { LoanLedgerPersonalInformationService } from './loanLedgerPersonalInformationService'

export class LoanLedgerPersonalInformationController {
	private readonly loanLedgerPersonalInformationService: LoanLedgerPersonalInformationService

	constructor() {
		this.loanLedgerPersonalInformationService = new LoanLedgerPersonalInformationService()
	}

	createLoanLedgerPersonalInfo = async (
		req: GetLoanLedgerPersonalInfoByUserIdRequest,
		res: Response,
		next: NextFunction
	) => {
		const user_id = +req.user.id
		const params = { ...req.body, user_id }
		try {
			const loanLedgerPersonalInfo = await this.loanLedgerPersonalInformationService.add(params)
			return res.status(200).send({
				data: {
					loanLedgerPersonalInfo
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Personal information already exists') {
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

	getLoanLedgerPersonalInfo = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const loanLedgerPersonalInfos = await this.loanLedgerPersonalInformationService.list()
			if(!loanLedgerPersonalInfos.length) {
				throw new Error("No data found")
			} 
			return res.status(200).send({
				data: {
					loanLedgerPersonalInfos
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

	getLoanLedgerPersonalInfoByUserId = async (
		req: GetLoanLedgerPersonalInfoByUserIdRequest,
		res: Response,
		next: NextFunction
	) => {
		const params_userId = +req.params.user_id
		const userId = +req.user.id

		try {
			const loanLedgerPersonalInfo = await this.loanLedgerPersonalInformationService.fetchByUserId(params_userId, userId)
			if(!loanLedgerPersonalInfo.length) {
				throw new Error('No data found')
			} 
			return res.status(200).send({
				data: {
					loanLedgerPersonalInfo
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

	getLoanLedgerPersonalInfoById = async (
		req: GetLoanLedgerPersonalInfoByIdRequest,
		res: Response,
		next: NextFunction
	) => {
		const id = +req.params.id
		const userId = +req.user.id

		try {
			const loalLedgerPersonalInfo = await this.loanLedgerPersonalInformationService.fetchById(id, userId)
			if(!loalLedgerPersonalInfo) {
				throw new Error('No data found')
			} 
			return res.status(200).send({
				data: {
					loalLedgerPersonalInfo
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

	updateLoanLedgerPersonalInfo = async (
		req: UpdateLoanLedgerPersonalInfoRequest,
		res: Response,
		next: NextFunction
	) => {
		const id = +req.params.id
		const user_id = +req.user.id
		const params = { ...req.body, user_id }
		try {
			const loanLedgerPersonalInfo = await this.loanLedgerPersonalInformationService.update(id, params)
			return res.status(200).send({
				data: {
					loanLedgerPersonalInfo
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

	deleteLoanLedgerPersonalInfo = async (
		req: DeleteLoanLedgerPersonalInfoRequest,
		res: Response,
		next: NextFunction
	) => {
		const id = +req.params.id
		const userId = +req.user.id
		try {
			const loanLedgerPersonalInfo = await this.loanLedgerPersonalInformationService.delete(id, userId)
			return res.status(200).send({
				data: {
					loanLedgerPersonalInfo
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
