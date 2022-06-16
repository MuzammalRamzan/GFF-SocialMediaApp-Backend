import { Request, Response, NextFunction } from 'express'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { DebtService } from './debtService'
import {
	CreateDebtRequest,
	DeleteDebtRequest,
	GetByIdRequest,
	GetDueDateByDebtIdRequest,
	UpdateDebtRequest
} from './interface'

export class DebtController {
	private readonly debtService: DebtService

	constructor() {
		this.debtService = new DebtService()
	}

	getAllDebts = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const debts = await this.debtService.list()
			if(!debts.length) {
				throw new Error('No data found')
			} 
			return res.status(200).send({
				data: {
					debts
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

	getById = async (req: GetByIdRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const userId = +req.user.id

		try {
			const debt = await this.debtService.fetchById(id, userId)
			if(!debt) {
				throw new Error('No data found')
			}
			return res.status(200).send({
				data: {
					debt
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
			else if (error.message === 'No data found') {
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

	getDueDateByDebtId = async (req: GetDueDateByDebtIdRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const userId = +req.user.id
		try {
			const dueDate = await this.debtService.fetchDueDateById(id, userId)
			if(!dueDate) {
				throw new Error("No data found")
			} 
			return res.status(200).send({
				data: {
					dueDate
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

	createDebt = async (req: CreateDebtRequest, res: Response, next: NextFunction) => {
		const user_id = +req.user.id
		const params = { ...req.body, user_id }

		try {
			const debt = await this.debtService.add(params)
			return res.status(200).send({
				data: {
					debt
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

	updateDebt = async (req: UpdateDebtRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const user_id = +req.user.id
		const params = { ...req.body, user_id }
		try {
			const debt = await this.debtService.update(id, params)
			return res.status(200).send({
				data: {
					debt
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

	deleteDebt = async (req: DeleteDebtRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const userId = +req.user.id
		try {
			const debt = await this.debtService.delete(id, userId)
			return res.status(200).send({
				data: {
					debt
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
