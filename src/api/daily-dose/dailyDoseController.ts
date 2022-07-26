import { Request, Response, NextFunction } from 'express'
import { AWS_S3_BASE_BUCKET_URL } from '../../constants'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { DailyDoseService } from './dailyDoseServices'
import { validationResult } from 'express-validator'
import { categoryType } from './interface'

import { createDoseRequest, GetByIdRequest, UpdateDoseRequest, DeleteDoseRequest } from './interface'
export class DailyDoseController {
	private readonly debtService: DailyDoseService

	constructor() {
		this.debtService = new DailyDoseService()
	}
	createDose = async (req: createDoseRequest, res: Response, next: NextFunction) => {
		const params = req.body
		try {
			if (!req.file) {
				throw new Error('Please upload a file')
			}
			const uploadImageInfo = await this.debtService.upload(req.file)
			params.image = AWS_S3_BASE_BUCKET_URL + uploadImageInfo.Key
			params.keyWord = JSON.stringify(params.keyWord)
			const errors = validationResult(req).array({ onlyFirstError: true })
			if (errors.length) {
				return res
					.status(400)
					.json({ errors: errors, message: 'The category type should be news, music or wise-words', code: 400 })
			}
			const dailyDose = await this.debtService.add(params)
			return res.status(200).json({ data: dailyDose, code: 200, message: `DailyDose posted sucessfully` })
		} catch (err) {
			next(err)
		}
	}
	getByCategory = async (req: GetByIdRequest, res: Response, next: NextFunction) => {
		let category = req.query.category as string
		let dailyDose
		try {
			if (category) {
				dailyDose = await this.debtService.findByCategory(category)
			} else {
				dailyDose = await this.debtService.findAllCategory(category)
			}
			if (!dailyDose) {
				throw new Error('No data found')
			}
			return res
				.status(200)
				.json({ data: dailyDose, code: 200, message: `DailyDose Data for all category '${category}'` })
		} catch (err) {
			next(err)
		}
	}
	updateDose = async (req: UpdateDoseRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const params = { ...req.body }

		try {
			if (req.file) {
				const uploadImageInfo = await this.debtService.upload(req.file)
				params.image = uploadImageInfo.Key
			}
			const dailyDose = await this.debtService.update(id, params)
			return res.status(200).json({ data: dailyDose, code: 200, message: `DailyDose Updated Successfully` })
		} catch (err) {
			next(err)
		}
	}
	deleteDose = async (req: DeleteDoseRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		try {
			const dailyDose = await this.debtService.delete(id)
			return res.status(200).json({ data: dailyDose, code: 200, message: `DailyDose deleted successfully` })
		} catch (err) {
			next(err)
		}
	}
}
