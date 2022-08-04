import { NextFunction, Request, Response } from 'express'
import { IAuthenticatedRequest } from '../helper/authMiddleware'
import { GffError, jsonErrorHandler } from '../helper/errorHandler'
import {
	CreatePromoCodesRequest,
	DeletePromocodeRequest,
	Messages,
	UpdatePromocodeRequest,
	UtilizePromocodeRequest
} from './interface'
import { PromocodeService } from './promocodeService'
import { PaginationType } from '../../helper/db.helper'
import { PAGE_SIZE } from '../../constants'
import { UserService } from '../user/userService'

const handleError = (err: any, req: IAuthenticatedRequest, res: Response) => {
	const error = err as GffError
	if (error.message === 'Unauthorized') {
		error.errorCode = '401'
		error.httpStatusCode = 401
	} else if (error.message === 'No data found') {
		error.errorCode = '404'
		error.httpStatusCode = 404
	} else if (error?.errorCode) {
		error.httpStatusCode = +error.errorCode
	} else {
		error.errorCode = '500'
		error.httpStatusCode = 500
	}
	return jsonErrorHandler(error, req, res, () => {
	})
}

export class PromocodeController {
	private readonly promocodeService: PromocodeService
	private readonly userService: UserService

	constructor() {
		this.promocodeService = new PromocodeService()
		this.userService = new UserService()
	}

	createBulkPromocodes = async (req: CreatePromoCodesRequest, res: Response, next: NextFunction) => {
		try {
			const promocode = await this.promocodeService.createBulkPromocodes(req.body)
			return res.status(200).send({
				data: {
					promocode
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			} else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {
			})
		}
	}

	list = async (req: Request, res: Response, next: NextFunction) => {
		try {

			const pagination: PaginationType = {
				page: +(req.query.page || 0) as number,
				pageSize: +(req.query.pageSize || PAGE_SIZE) as number
			}

			const promocodes = await this.promocodeService.list(pagination)
			return res.status(200).send({
				data: {
					promocodes
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			} else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {
			})
		}
	}

	updatePromocode = async (req: UpdatePromocodeRequest, res: Response) => {
		const id = +req.params.id
		const params = req.body

		try {
			const promocodes = await this.promocodeService.fetchById(id)
			if (!promocodes.length) {
				throw new Error(Messages.PROMOCODE_NOT_FOUND)
			}

			const promocode = await this.promocodeService.update(id, params)
			return res.status(200).send({
				data: {
					promocode: promocode
				},
				code: 200,
				message: Messages.UPDATE_PROMOCODE
			})
		} catch (err) {
			const error = err as GffError

			if (error.name === 'SequelizeUniqueConstraintError') {
				error.errorCode = '403'
				error.httpStatusCode = 403
				error.message = Messages.INVALID_PROMOCODE
			} else if (error.message === Messages.UNAUTHORIZED) {
				error.errorCode = '401'
				error.httpStatusCode = 401
			} else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {
			})
		}
	}

	utilize = async (req: UtilizePromocodeRequest, res: Response) => {
		try {
			const promocode = await this.promocodeService.fetchByPromocode(req.params.promocode)

			if (promocode === null) {
				throw new Error(Messages.PROMOCODE_NOT_FOUND)
			}

			const plain = promocode.get({ plain: true })

			if (plain.status === 'USED') {
				throw new Error(Messages.PROMOCODE_USED)
			}

			if (plain.status === 'EXPIRED') {
				throw new Error(Messages.PROMOCODE_EXPIRED)
			}

			if (new Date(plain.expiration_date) <= new Date()) {
				plain.status = 'EXPIRED'
				await this.promocodeService.update(plain.id, plain)
				throw new Error(Messages.PROMOCODE_EXPIRED)
			}

			plain.status = 'USED'
			await this.promocodeService.update(plain.id, plain)

			const user_id = +req.user.id
			const user = await this.userService.fetchById(user_id, user_id)
			await user.update({ is_pro: true })

			// add entry in users table also.
			return res.status(200).send({
				data: {},
				code: 200,
				message: Messages.PROMOCODE_APPLIED
			})
		} catch (err) {
			const error = err as GffError

			if (error.name === 'SequelizeUniqueConstraintError') {
				error.errorCode = '403'
				error.httpStatusCode = 403
				error.message = Messages.INVALID_PROMOCODE
			} else if (error.message === Messages.UNAUTHORIZED) {
				error.errorCode = '401'
				error.httpStatusCode = 401
			} else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {
			})
		}
	}

	deletePromocode = async (req: DeletePromocodeRequest, res: Response, next: NextFunction) => {
		const id = +req.params.id
		try {
			const promocode = await this.promocodeService.delete(id)
			return res.status(200).send({
				data: {
					promocode
				},
				code: 200,
				message: 'OK'
			})
		} catch (err) {
			const error = err as GffError
			if (error.message === 'Unauthorized') {
				error.errorCode = '401'
				error.httpStatusCode = 401
			} else {
				error.errorCode = '500'
				error.httpStatusCode = 500
			}
			return jsonErrorHandler(err, req, res, () => {
			})
		}
	}

}
