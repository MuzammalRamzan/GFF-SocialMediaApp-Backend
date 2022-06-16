import { Request, Response, NextFunction } from 'express'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import { HashtagService } from './hashtagService'
import {
	CreateHashtagRequest,
	DeleteHashtagRequest,
	GetHashtagByUserInformationIdRequest,
	UpdateHashtagRequest
} from './interface'

export class HashtagController {
	private readonly hashtagService: HashtagService

	constructor() {
		this.hashtagService = new HashtagService()
	}

	getAllHashtags = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const hashtags = await this.hashtagService.list()
			if(!hashtags.length) {
				throw new Error("No data found")
			} 
			return res.status(200).send({
				data: {
					hashtags
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			}
			else if  (error.message === 'No data found') {
				error.errorCode = '404'
				error.httpStatusCode = 404
			}
			else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	createHashtag = async (req: CreateHashtagRequest, res: Response, next: NextFunction) => {
		const userId = +req.user.id
		const params = req.body

		try {
			const hashtag = await this.hashtagService.add(params, userId)
			return res.status(200).send({
				data: {
					hashtag
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
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

	getHashtagByUserInformationId = async (
		req: GetHashtagByUserInformationIdRequest,
		res: Response,
		next: NextFunction
	) => {
		const id = +req.params.user_info_id

		try {
			const hashtags = await this.hashtagService.fetchById(id)
			if(!hashtags.length) {
				throw new Error('No data found')
			}
			return res.status(200).send({
				data: {
					hashtags
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			}
			else if  (error.message === 'No data found') {
				error.errorCode = '404'
				error.httpStatusCode = 404
			}
			else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	updateHashtag = async (req: UpdateHashtagRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		const params = req.body

		try {
			const hashtag = await this.hashtagService.update(id, params)
			return res.status(200).send({
				data: {
					hashtag
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
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

	deleteHashtag = async (req: DeleteHashtagRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id

		try {
			const hashtag = await this.hashtagService.delete(id)
			return res.status(200).send({
				data: {
					hashtag
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
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
