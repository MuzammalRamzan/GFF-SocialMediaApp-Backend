import { Request, Response, NextFunction } from 'express'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import {
	CreateRecordRequest,
	DeleteRecordRequest,
	GetAllRecordsByUserIdRequest,
	UpdateRecordRequest
} from './interface'
import { RecordService } from './recordService'

export class RecordController {
	private readonly recordService: RecordService

	constructor() {
		this.recordService = new RecordService()
	}

	getAllRecords = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const records = await this.recordService.list()
			if(!records.length) {
				throw new Error('No data found')
			}
			return res.status(200).send({
				data: {
					records
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

	getAllRecordsByUserId = async (req: GetAllRecordsByUserIdRequest, res: Response, next: NextFunction) => {
		const userId = +req.user.id
		try {
			const records = await this.recordService.listByUserId(userId)
			if(!records.length) {
				throw new Error('No data found')
			}
			return res.status(200).send({
				data: {
					records
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

	createRecord = async (req: CreateRecordRequest, res: Response, next: NextFunction) => {
		const userId = +req.user.id
		const params = req.body

		try {
			const record = await this.recordService.add(params, userId)
			return res.status(200).send({
				data: {
					record
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

	updateRecord = async (req: UpdateRecordRequest, res: Response, next: NextFunction) => {
		const userId = +req.user.id
		const id = +req.params.id
		const params = req.body
		try {
			const record = await this.recordService.update(id, params, userId)
			return res.status(200).send({
				data: {
					record
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

	deleteRecord = async (req: DeleteRecordRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		try {
			const record = await this.recordService.delete(id)
			return res.status(200).send({
				data: {
					record
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
