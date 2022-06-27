import { Request, Response, NextFunction } from 'express'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { DailyDoseService } from './dailyDoseServices'
import aws from 'aws-sdk';
import multer, { FileFilterCallback } from 'multer';
import multerS3 from 'multer-s3';
const s3 = new aws.S3();
import {
	createDoseRequest
} from './interface'

export class DailyDoseController {
	private readonly debtService: DailyDoseService

	constructor() {
		this.debtService = new DailyDoseService()
	}
	createDose = async (req: createDoseRequest, res: Response, next: NextFunction) => {
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
      console.log(err);
      
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
