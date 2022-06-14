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
			res.status(200).send({ professionalInformation })
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
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
			res.send(professionalInformation)
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
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
			res.send(professionalInformation)
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	createLoanLedgerProfessionalInformation = async (
		req: CreateLoanLedgerProfessionalInformationRequest,
		res: Response,
		next: NextFunction
	) => {
		const user_id = +req.user.id
		const params = { ...req.body, user_id }

		try {
			const professionalInformation = await this.loanLedgerProfessionalInformationService.add(params)
			res.status(200).send(professionalInformation)
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
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
		const params = { ...req.body, user_id }

		try {
			const professionalInformation = await this.loanLedgerProfessionalInformationService.update(id, params)
			res.status(200).send(professionalInformation)
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
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
			res.status(200).send({ professionalInformation })
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			return jsonErrorHandler(err, req, res, () => {})
		}
	}
}
