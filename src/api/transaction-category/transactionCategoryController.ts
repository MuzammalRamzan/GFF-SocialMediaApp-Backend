import { Request, Response, NextFunction } from 'express'
import { GffError, jsonErrorHandler, UNAUTHORIZED } from '../helper/errorHandler'
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
			next(err);
		}
	}

	getAllTransactionCategories = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const transactionCategories = await this.transactionCategoryService.list()
			if (!transactionCategories.length) {
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
			next(err);
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
			if (!transactionCategories.length) {
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
			next(err);
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
			if (await TransactionCategoryService.isDefaultCategory(id)) {
				throw new GffError("You're not allowed to update default category!", { errorCode: '403' })
			}

			const transactionCategory = await this.transactionCategoryService.update(id, params)
			return res.status(200).send({
				data: {
					transactionCategory
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			next(err)
		}
	}

	deleteTransactionCategory = async (req: DeleteTransactionCategoryRequest, res: Response, next: NextFunction) => {
		const userId = +req.user.id
		const id = +req.params.id
		try {
			if (await TransactionCategoryService.isDefaultCategory(id)) {
				throw new GffError("You're not allowed to delete default category!", { errorCode: '403' })
			}

			const transactionCategory = await this.transactionCategoryService.delete(id, userId)
			return res.status(200).send({
				data: {
					transactionCategory
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			next(err)
		}
	}
}
