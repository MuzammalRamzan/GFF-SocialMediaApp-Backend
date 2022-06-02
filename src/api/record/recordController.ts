import { Request, Response, NextFunction } from 'express'
import { CreateRecordRequest, DeleteRecordRequest, UpdateRecordRequest } from './interface'
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
			throw err
		}
	}

	createRecord = async (req: CreateRecordRequest, res: Response, next: NextFunction) => {
		const params = req.body

		try {
			const record = await this.recordService.add(params)
			res.status(200).send({ record })
		} catch (err) {
			throw err
		}
	}

	updateRecord = async (req: UpdateRecordRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const params = req.body
		try {
			const record = await this.recordService.update(id, params)
			res.status(200).send({ record })
		} catch (err) {
			throw err
		}
	}

	deleteRecord = async (req: DeleteRecordRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		try {
			const record = await this.recordService.delete(id)
			res.status(200).send({ record })
		} catch (err) {
			throw err
		}
	}
}
