import { Request, Response, NextFunction } from 'express'
import { Json } from 'sequelize/types/utils'
import { AWS_S3_BASE_BUCKET_URL } from '../../constants'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { DailyArticleService } from './dailyArticleServices'

import {
	createArticleRequest,
	GetByIdRequest,
	UpdateArticleRequest,
	DeleteArticleRequest,
	categoryType
} from './interface'
export class DailyArticleController {
	private readonly ArticleService: DailyArticleService

	constructor() {
		this.ArticleService = new DailyArticleService()
	}
	createArticle = async (req: createArticleRequest, res: Response, next: NextFunction) => {
		const params = req.body
		try {
			if (!req.file) {
				throw new Error('Please upload a file')
			}
			if (!params.category) {
				throw new Error('Category is not passed')
			}
			const uploadImageInfo = await this.ArticleService.upload(req.file)
			params.image = AWS_S3_BASE_BUCKET_URL + uploadImageInfo.Key
			params.category = JSON.stringify(params.category)
			const dailyArticle = await this.ArticleService.add(params)
			return res.status(200).json({ dailyArticle })
		} catch (err) {
			next(err)
		}
	}
	getByCategory = async (req: GetByIdRequest, res: Response, next: NextFunction) => {
		let category = req.query.category as string
		let dailyArticle
		try {
			if (category) {
				dailyArticle = await this.ArticleService.findByCategory(category)
			} else {
				dailyArticle = await this.ArticleService.findAllCategory(category)
			}
			if (!dailyArticle) {
				throw new Error('No data found')
			}
			return res.status(200).json({ dailyArticle })
		} catch (err) {
			next(err)
		}
	}
	updateArticle = async (req: UpdateArticleRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const params = { ...req.body }

		try {
			if (req.file) {
				const uploadImageInfo = await this.ArticleService.upload(req.file)
				params.image = AWS_S3_BASE_BUCKET_URL + uploadImageInfo.Key
			}
			const dailyArticle = await this.ArticleService.update(id, params)
			return res.status(200).json({ dailyArticle })
		} catch (err) {
			next(err)
		}
	}
	deleteArticle = async (req: DeleteArticleRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		try {
			const dailyArticle = await this.ArticleService.delete(id)
			return res.status(200).json({ dailyArticle })
		} catch (err) {
			next(err)
		}
	}
}
