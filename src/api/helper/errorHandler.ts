import { ErrorRequestHandler } from 'express'

export enum HttpStatusCodes {
	BAD_REQUEST = 400,
	PAGE_NOT_FOUND = 404,
	INTERNAL_SERVER_ERROR = 500
}

export const jsonErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
	if (typeof err.code === 'string' && (err.code.startsWith('42') || err.code.startsWith('22'))) {
		err.message = 'Internal server error: Database error during request'
	}
	const { errorCode, httpStatusCode } = err

	if (typeof err.code === 'undefined') {
		err.message = 'Bad request info does not exist'
		res.statusCode = httpStatusCode ?? HttpStatusCodes.BAD_REQUEST
		return res.json({
			error: errorCode ?? 'BAD_REQUEST',
			message: err.message
		})
	}

	res.statusCode = httpStatusCode ?? HttpStatusCodes.INTERNAL_SERVER_ERROR
	return res.json({
		error: errorCode ?? 'INTERNAL_SERVER_ERROR',
		message: err.message
	})
}
