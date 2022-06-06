import { Request, Response, NextFunction } from 'express'
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
			throw err
		}
	}

	getLoanLedgerProfessionalInformationById = async (
		req: GetLoanLedgerProfessionalInformationByIdRequest,
		res: Response,
		next: NextFunction
	) => {
		const id = +req.params.id

		try {
			const professionalInformation = await this.loanLedgerProfessionalInformationService.fetchById(id)
			res.send(professionalInformation)
		} catch (err) {
			throw err
		}
	}

	getLoanLedgerProfessionalInformationByUserId = async (
		req: GetLoanLedgerProfessionalInformationByUserIdRequest,
		res: Response,
		next: NextFunction
	) => {
		const user_id = +req.params.user_id

		try {
			const professionalInformation = await this.loanLedgerProfessionalInformationService.fetchByUserId(user_id)
			res.send(professionalInformation)
		} catch (err) {
			throw err
		}
	}

	createLoanLedgerProfessionalInformation = async (
		req: CreateLoanLedgerProfessionalInformationRequest,
		res: Response,
		next: NextFunction
	) => {
		const params = req.body

		try {
			const professionalInformation = await this.loanLedgerProfessionalInformationService.add(params)
			res.status(200).send({ professionalInformation })
		} catch (err) {
			throw err
		}
	}

	updateLoanLedgerProfessionalInformation = async (
		req: UpdateLoanLedgerProfessionalInformationRequest,
		res: Response,
		next: NextFunction
	) => {
		const id = +req.params.id
		const params = req.body

		try {
			const professionalInformation = await this.loanLedgerProfessionalInformationService.update(id, params)
			res.status(200).send({ professionalInformation })
		} catch (err) {
			throw err
		}
	}

	deleteLoanLedgerProfessionalInformation = async (
		req: DeleteLoanLedgerProfessionalInformationRequest,
		res: Response,
		next: NextFunction
	) => {
		const id = +req.params.id

		try {
			const professionalInformation = await this.loanLedgerProfessionalInformationService.delete(id)
			res.status(200).send({ professionalInformation })
		} catch (err) {
			throw err
		}
	}
}
