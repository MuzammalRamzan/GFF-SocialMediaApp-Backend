import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { GffError } from '../api/helper/errorHandler'

export const validateReq = (req: Request, res: Response, next: NextFunction) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			throw new GffError(`${errors.array()[0].param}: ${errors.array()[0].msg}`, { errorCode: '400' })
		}
		next()
	} catch (error) {
		next(error)
	}
}
