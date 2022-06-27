import { Request, Response, NextFunction } from 'express'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { DailyDoseService } from './dailyDoseServices'
import aws from 'aws-sdk';
const s3 = new aws.S3();
import {
  createDoseRequest,
  GetByIdRequest,
  UpdateDoseRequest,
  DeleteDoseRequest
} from './interface'
export class DailyDoseController {
	private readonly debtService: DailyDoseService

	constructor() {
		this.debtService = new DailyDoseService()
	}
	createDose = async (req: createDoseRequest, res: Response, next: NextFunction) => {
    const params = req.body;
		try {
			const dailyDose = await this.debtService.add(params)
			if (params.category !== "news" && params.category != "music" && params.category != "wise-words") {
				throw new Error('Enum can be one of them:news,music,wise-words')
			}
			return res.status(200).json({ dailyDose });
		} catch (err) {
			next(err);
		}
  }
	getByCategory = async (req: GetByIdRequest, res: Response, next: NextFunction) => {
		let category = req.query.category as string;
		let dailyDose;
		try {
			if (category) {
				dailyDose = await this.debtService.findByCategory(category)
			} else {
				dailyDose = await this.debtService.findAllCategory(category)
			}
			if (!dailyDose) {
				throw new Error('No data found')
			}
			return res.status(200).json({ dailyDose });
		} catch (err) {
			next(err);
		}
	}
  updateDose = async (req: UpdateDoseRequest, res: Response, next: NextFunction) => {
    const id = +req.params.id
		const params = { ...req.body}
		try {
			const dailyDose = await this.debtService.update(id, params)
			return res.status(200).json({ dailyDose });
		} catch (err) {
			next(err);
		}
  }
  deleteDose = async (req: DeleteDoseRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		try {
			const dailyDose = await this.debtService.delete(id)
			return res.status(200).json({ dailyDose });
		} catch (err) {
			next(err);
		}
	}
}
