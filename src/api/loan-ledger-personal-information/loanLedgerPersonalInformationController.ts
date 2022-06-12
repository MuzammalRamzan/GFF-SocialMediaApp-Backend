import { Response, NextFunction, Request } from 'express'
import { jsonErrorHandler } from '../helper/errorHandler'
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
			res.status(200).send(loanLedgerPersonalInfo)
		} catch (err) {
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	getLoanLedgerPersonalInfo = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const loanPersonalInfos = await this.loanLedgerPersonalInformationService.list()
			res.status(200).send(loanPersonalInfos)
		} catch (err) {
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
			const userInformation = await this.loanLedgerPersonalInformationService.fetchByUserId(params_userId, userId)
			res.status(200).send(userInformation)
		} catch (err) {
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
			res.status(200).send(loalLedgerPersonalInfo)
		} catch (err) {
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
			res.status(200).send(loanLedgerPersonalInfo)
		} catch (err) {
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
			const userInformation = await this.loanLedgerPersonalInformationService.delete(id, userId)
			res.send({ userInformation })
		} catch (err) {
			return jsonErrorHandler(err, req, res, () => {})
		}
	}
}
