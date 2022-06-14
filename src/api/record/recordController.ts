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
			res.status(200).send({ records })
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			error.httpStatusCode = 401
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	getAllRecordsByUserId = async (req: GetAllRecordsByUserIdRequest, res: Response, next: NextFunction) => {
		const userId = +req.user.id
		try {
			const records = await this.recordService.listByUserId(userId)
			res.status(200).send(records)
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			error.httpStatusCode = 401
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	createRecord = async (req: CreateRecordRequest, res: Response, next: NextFunction) => {
		const userId = +req.user.id
		const params = req.body

		try {
			const record = await this.recordService.add(params, userId)
			res.status(200).send({ record })
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			error.httpStatusCode = 401
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	updateRecord = async (req: UpdateRecordRequest, res: Response, next: NextFunction) => {
		const userId = +req.user.id
		const id = +req.params.id
		const params = req.body
		try {
			const record = await this.recordService.update(id, params, userId)
			res.status(200).send({ record })
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			error.httpStatusCode = 401
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	deleteRecord = async (req: DeleteRecordRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		try {
			const record = await this.recordService.delete(id)
			res.status(200).send({ record })
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			error.httpStatusCode = 401
			return jsonErrorHandler(err, req, res, () => {})
		}
	}
}
