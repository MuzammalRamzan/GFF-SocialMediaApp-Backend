import { Request, Response, NextFunction } from 'express'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { IUploadRequest } from './interface'
import { UploadService } from './uploadService'

export class UploadController {
	private readonly UploadService: UploadService

	constructor() {
		this.UploadService = new UploadService()
	}

	private handleError = (err: any, req: IUploadRequest, res: Response) => {
		const error = err as GffError
		if (error.message === 'User information already exists') {
			error.errorCode = '409'
			error.httpStatusCode = 409
		} else {
			error.errorCode = '500'
			error.httpStatusCode = 500
		}
		return jsonErrorHandler(err, req, res, () => {})
	}

	uploadAvatar = async (req: IUploadRequest, res: Response, next: NextFunction) => {
		try {
			const user_id = +req.user.id

			if (!req.file) {
				throw new Error('Please upload a file')
			}

			const userInformation = await this.UploadService.uploadAvatar(user_id, req.file)

			return res.status(200).json({
				data: { userInformation },
				code: 200,
				message: 'OK'
			})
		} catch (error) {
			return this.handleError(error, req, res)
		}
	}
}
