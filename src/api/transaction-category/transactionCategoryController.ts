import { Request, Response, NextFunction } from 'express'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import {
	CreateTransactionCategoryRequest,
	DeleteTransactionCategoryRequest,
	GetTransactionCategoriesByUserIdRequest,
	UpdateTransactionCategoryByIdRequest
} from './interface'
import { TransactionCategoryService } from './transactionCategoryService'

export class TransactionCategotryController {
	private readonly transactionCategoryService: TransactionCategoryService

	constructor() {
		this.transactionCategoryService = new TransactionCategoryService()
	}

	createTransactionCategory = async (req: CreateTransactionCategoryRequest, res: Response, next: NextFunction) => {
		const user_id = req.user.id
		const params = { ...req.body, user_id }
		try {
			const transactionCategory = await this.transactionCategoryService.add(params)
			return res.status(200).send({
				data: {
					transactionCategory
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

	getAllTransactionCategories = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const transactionCategories = await this.transactionCategoryService.list()
			if(!transactionCategories.length) {
				throw new Error('No data found')
			}
			return res.status(200).send({
				data: {
					transactionCategories
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

	getTransactionCategoriesByUserId = async (
		req: GetTransactionCategoriesByUserIdRequest,
		res: Response,
		next: NextFunction
	) => {
		const id = +req.user.id

		try {
			const transactionCategories = await this.transactionCategoryService.fetchByUserId(id)
			if(!transactionCategories.length) {
				throw new Error('No data found')
			}
			return res.status(200).send({
				data: {
					transactionCategories
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

	updateTransactionCategoryById = async (
		req: UpdateTransactionCategoryByIdRequest,
		res: Response,
		next: NextFunction
	) => {
		const user_id = +req.user.id
		const id = +req.params.id
		const params = { ...req.body, user_id }
		try {
			const transactionCategory = await this.transactionCategoryService.update(id, params)
			return res.status(200).send({
				data: {
					transactionCategory
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

	deleteTransactionCategory = async (req: DeleteTransactionCategoryRequest, res: Response, next: NextFunction) => {
		const userId = +req.user.id
		const id = +req.params.id
		try {
			const transactionCategory = await this.transactionCategoryService.delete(id, userId)
			return res.status(200).send({
				data: {
					transactionCategory
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
