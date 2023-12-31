import { Request, Response, NextFunction } from 'express'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import {
	CreateLoanLedgerProfessionalInformationRequest,
	UpdateLoanLedgerProfessionalInformationRequest,
	DeleteLoanLedgerProfessionalInformationRequest,
	GetLoanLedgerProfessionalInformationByIdRequest,
	GetLoanLedgerProfessionalInformationByUserIdRequest
} from './interface'
import { LoanLedgerProfessionalInformationService } from './professionalInformationService'

export class LoanLedgerProfessionalInformationController {
	private readonly loanLedgerProfessionalInformationService: LoanLedgerProfessionalInformationService

	constructor() {
		this.loanLedgerProfessionalInformationService = new LoanLedgerProfessionalInformationService()
	}

	getAllLoanLedgerProfessionalInformations = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const professionalInformation = await this.loanLedgerProfessionalInformationService.list()
			if (!professionalInformation.length) {
				throw new Error('No data found')
			}
			return res.status(200).send({
				data: {
					professionalInformation
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

	getLoanLedgerProfessionalInformationById = async (
		req: GetLoanLedgerProfessionalInformationByIdRequest,
		res: Response,
		next: NextFunction
	) => {
		const id = +req.params.id
		const userId = +req.user.id

		try {
			const professionalInformation = await this.loanLedgerProfessionalInformationService.fetchById(id, userId)
			if (!professionalInformation) {
				throw new Error('No data found')
			}
			return res.status(200).send({
				data: {
					professionalInformation
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

	getLoanLedgerProfessionalInformationByUserId = async (
		req: GetLoanLedgerProfessionalInformationByUserIdRequest,
		res: Response,
		next: NextFunction
	) => {
		const user_id = +req.user.id

		try {
			const professionalInformation = await this.loanLedgerProfessionalInformationService.fetchByUserId(user_id)
			if (!professionalInformation.length) {
				throw new Error('No data found')
			}
			return res.status(200).send({
				data: {
					professionalInformation
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

	createLoanLedgerProfessionalInformation = async (
		req: CreateLoanLedgerProfessionalInformationRequest,
		res: Response,
		next: NextFunction
	) => {
		const user_id = +req.user.id

		if (!req.file) {
			throw new Error('Please upload a document')
		}

		const params = { ...req.body, user_id, document: req.file }

		try {
			const professionalInformation = await this.loanLedgerProfessionalInformationService.add(params)
			return res.status(200).send({
				data: {
					professionalInformation
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Professional information already exists') {
				error.errorCode = '409'
				error.httpStatusCode = 409
			} else if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			} else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	updateLoanLedgerProfessionalInformation = async (
		req: UpdateLoanLedgerProfessionalInformationRequest,
		res: Response,
		next: NextFunction
	) => {
		const id = +req.params.id
		const user_id = +req.user.id
		let params = { ...req.body, user_id }

		if (req.file) {
			params = { ...params, document: req.file }
		}

		try {
			const professionalInformation = await this.loanLedgerProfessionalInformationService.update(id, params)
			return res.status(200).send({
				data: {
					professionalInformation
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

	deleteLoanLedgerProfessionalInformation = async (
		req: DeleteLoanLedgerProfessionalInformationRequest,
		res: Response,
		next: NextFunction
	) => {
		const id = +req.params.id
		const userId = +req.user.id

		try {
			const professionalInformation = await this.loanLedgerProfessionalInformationService.delete(id, userId)
			return res.status(200).send({
				data: {
					professionalInformation
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
}
