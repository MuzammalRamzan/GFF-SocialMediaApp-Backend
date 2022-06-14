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
			res.status(200).send(transactionCategory)
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	getAllTransactionCategories = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const transactionCategories = await this.transactionCategoryService.list()
			res.status(200).send(transactionCategories)
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	getTransactionCategoriesByUserId = async (
		req: GetTransactionCategoriesByUserIdRequest,
		res: Response,
		next: NextFunction
	) => {
		const userId = +req.user.id
		try {
			const transactionCategories = await this.transactionCategoryService.fetchByUserId(userId)
			res.status(200).send(transactionCategories)
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
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
			res.send(transactionCategory)
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	deleteTransactionCategory = async (req: DeleteTransactionCategoryRequest, res: Response, next: NextFunction) => {
		const userId = +req.user.id
		const id = +req.params.id
		try {
			const transactionCategory = await this.transactionCategoryService.delete(id, userId)
			res.status(200).send({ transactionCategory })
		} catch (err) {
			const error = err as GffError
			error.errorCode = '401'
			return jsonErrorHandler(err, req, res, () => {})
		}
	}
}
