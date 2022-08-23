import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import moment from 'moment'
import { GffError } from '../helper/errorHandler'
import { WellnessWarriorsCertificateService } from './wellnessWarriorCertificateService'

export class WarriorInformationController {
	private warriorCertificateService: WellnessWarriorsCertificateService

	constructor() {
		this.warriorCertificateService = new WellnessWarriorsCertificateService()
	}

	findById = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const {
				params: { id }
			} = req
			const warriorCertificate = await this.warriorCertificateService.getCertificateById(+id)
			res.status(200).json({
				data: {
					warriorCertificate
				},
				message: 'fetch warrior certificate successfully',
				code: 200
			})
		} catch (err) {
			next(err)
		}
	}

	create = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = validationResult(req).array({ onlyFirstError: true })
			if (errors.length) {
				return res.status(400).json({ errors: errors, message: 'Validation error', code: 400 })
			}

			const {
				body: { authority, title, year, wellness_warrior_id }
			} = req

			if (+year >= +moment().format('YYYY') || year.length !== 4) {
				const err = new GffError('Enter valid year')
				err.errorCode = '404'
				err.httpStatusCode = 404
				throw err
			}

			if (!req.file) {
				throw new Error('Please upload a file')
			}

			const reqData = {
				wellness_warrior_id,
				authority,
				title,
				year,
				pdfFile: req.file
			}

			const warriorCertificate = await this.warriorCertificateService.create(reqData)
			res.status(200).json({
				data: {
					warriorCertificate
				},
				message: 'Warrior certificate created successfully',
				code: 200
			})
		} catch (err) {
			next(err)
		}
	}

	update = async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!req.params.id) {
				const err = new GffError('enter wellness warrior certificate id')
				err.errorCode = '404'
				err.httpStatusCode = 404
				throw err
			}

			let reqData = {
				...req.body,
				id: req.params.id
			}

			if (req.file) {
				reqData = {
					...reqData,
					pdfFile: req.file
				}
			}

			const warriorCertificate = await this.warriorCertificateService.update(reqData)
			res.status(200).json({
				data: {
					warriorCertificate
				},
				message: 'Warrior certificate updated successfully',
				code: 200
			})
		} catch (err) {
			next(err)
		}
	}

	getAllWarriorsCertificates = async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!req.params.id || isNaN(+req.params.id)) {
				const err = new GffError('enter valid wellness warrior id')
				err.errorCode = '404'
				err.httpStatusCode = 404
				throw err
			}
			const wellness_warriors_certificates = await this.warriorCertificateService.getAll(+req.params.id)
			return res.status(200).json({ data: { wellness_warriors_certificates }, code: 200, message: 'OK' })
		} catch (err) {
			next(err)
		}
	}

	delete = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const {
				params: { id }
			} = req
			const warriorCertificate = await this.warriorCertificateService.deleteCertificateById(+id)

			if (warriorCertificate) {
				res.status(200).json({
					message: 'delete warrior certificate successfully',
					code: 200
				})
			}
		} catch (err) {
			next(err)
		}
	}
}
