import { Request, Response, NextFunction } from 'express'
import { AWS_S3_BASE_BUCKET_URL } from '../../constants'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { DailyDoseService } from './dailyDoseServices'
import { validationResult } from 'express-validator'
import { categoryType } from './interface'
import { createDoseRequest, GetByIdRequest, UpdateDoseRequest, DeleteDoseRequest } from './interface'
export class DailyDoseController {
	private readonly dailyDoseServices: DailyDoseService

	constructor() {
		this.dailyDoseServices = new DailyDoseService()
	}
	createDose = async (req: createDoseRequest, res: Response, next: NextFunction) => {
		const params = req.body
		try {
			if (!req.file) {
				throw new Error('Please upload a file')
			}
			const errors = validationResult(req).array({ onlyFirstError: true })
			if (errors.length) {
				return res
					.status(400)
					.json({ errors: errors, message: 'The category type should be news, music or wise-words', code: 400 })
			}
			const isValidURL = await this.dailyDoseServices.validURL(params.contentURL)
			if (params.contentURL && !isValidURL) {
				const file = await this.dailyDoseServices.asyncWriteFile(params.contentURL)
				const uploadContentInfo = await this.dailyDoseServices.uploadContentBody(file)
				params.contentURL = AWS_S3_BASE_BUCKET_URL + uploadContentInfo.Key
				params.isInternalLink = true
			}
			const uploadImageInfo = await this.dailyDoseServices.upload(req.file)
			params.image = AWS_S3_BASE_BUCKET_URL + uploadImageInfo.Key
			params.keyWord = JSON.stringify(params.keyWord)
			console.log('Params: ', params)
			const dailyDose = await this.dailyDoseServices.add(params)
			console.log('Daily Dose: ', dailyDose)
			console.log('--------------Create Dose Done successfully--------------------')
			return res.status(200).json({ data: dailyDose, code: 200, message: `DailyDose posted sucessfully` })
		} catch (err) {
			console.log('err', err)
			next(err)
		}
	}
	getByCategory = async (req: GetByIdRequest, res: Response, next: NextFunction) => {
		let category = req.query.category as string
		let dailyDose
		try {
			dailyDose = await this.dailyDoseServices.findByCategory(category)
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
				const uploadImageInfo = await this.dailyDoseServices.upload(req.file)
				params.image = AWS_S3_BASE_BUCKET_URL + uploadImageInfo.Key
			}
			const isValidURL = await this.dailyDoseServices.validURL(params.contentURL)
			if (params.contentURL && !isValidURL) {
				const file = await this.dailyDoseServices.asyncWriteFile(params.contentURL)
				const uploadContentInfo = await this.dailyDoseServices.uploadContentBody(file)
				params.contentURL = AWS_S3_BASE_BUCKET_URL + uploadContentInfo.Key
				params.isInternalLink = true
			}
			params.keyWord = JSON.stringify(params.keyWord)
			const dailyDose = await this.dailyDoseServices.update(id, params)
			return res.status(200).json({ data: dailyDose, code: 200, message: `DailyDose Updated Successfully` })
		} catch (err) {
			next(err)
		}
	}
	deleteDose = async (req: DeleteDoseRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		try {
			const dailyDose = await this.dailyDoseServices.delete(id)
			return res.status(200).json({ data: dailyDose, code: 200, message: `DailyDose deleted successfully` })
		} catch (err) {
			next(err)
		}
	}
}
