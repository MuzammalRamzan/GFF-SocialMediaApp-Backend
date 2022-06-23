import { Request, Response, NextFunction } from 'express'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { ISettings } from './interface'

export class SettingsController {
	private readonly settings: ISettings = {
		industries: [
			'Agriculture',
			'Mining',
			'Utilities',
			'Construction',
			'Wholesale trade',
			'Retail trade',
			'Real estate'
		],
		roles: [
			'Legal',
			'Human Resources',
			'Finance and Accounting',
			'Marketing',
			'Sales',
			'Research and Development',
			'Information Technology'
		],
		frequencies: ['Daily', 'Weekly', 'Monthly'],
		modes: ['Audio', 'Video', 'Text'],
		languages: ['English']
	}

	handleError = async (err: any, req: Request, res: Response) => {
		const error = err as GffError
		if (error.message === 'No data found') {
			error.errorCode = '404'
			error.httpStatusCode = 404
		} else {
			error.errorCode = '500'
			error.httpStatusCode = 500
		}
		return jsonErrorHandler(err, req, res, () => { })
	}

	getAllIndustries = async (req: Request, res: Response, next: NextFunction) => {
		try {
			return res.status(200).json({
				code: 200,
				message: 'OK',
				data: {
					industries: this.settings.industries.map((item: string) => ({
						key: item.toLowerCase(),
						name: item
					}))
				}
			})
		} catch (err) {
			return this.handleError(err, req, res)
		}
	}

	getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
		try {
			return res.status(200).json({
				code: 200,
				message: 'OK',
				data: {
					roles: this.settings.roles.map((item: string) => ({
						key: item.toLowerCase(),
						name: item
					}))
				}
			})
		} catch (err) {
			return this.handleError(err, req, res)
		}
	}

	getAllFrequencies = async (req: Request, res: Response, next: NextFunction) => {
		try {
			return res.status(200).json({
				code: 200,
				message: 'OK',
				data: {
					frequencies: this.settings.frequencies.map((item: string) => ({
						key: item.toLowerCase(),
						name: item
					}))
				}
			})
		} catch (err) {
			return this.handleError(err, req, res)
		}
	}

	getAllModes = async (req: Request, res: Response, next: NextFunction) => {
		try {
			return res.status(200).json({
				code: 200,
				message: 'OK',
				data: {
					modes: this.settings.modes.map((item: string) => ({
						key: item.toLowerCase(),
						name: item
					}))
				}
			})
		} catch (err) {
			return this.handleError(err, req, res)
		}
	}

	getAllLanguages = async (req: Request, res: Response, next: NextFunction) => {
		try {
			return res.status(200).json({
				code: 200,
				message: 'OK',
				data: {
					languages: this.settings.languages.map((item: string) => ({
						key: item.toLowerCase(),
						name: item
					}))
				}
			})
		} catch (err) {
			return this.handleError(err, req, res)
		}
	}
}
