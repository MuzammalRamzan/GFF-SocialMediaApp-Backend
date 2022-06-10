import { ErrorRequestHandler } from 'express'

export enum HttpStatusCodes {
	INTERNAL_SERVER_ERROR = 500
}

export const jsonErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
	if (typeof err.code === 'string' && (err.code.startsWith('42') || err.code.startsWith('22'))) {
		err.message = 'Internal server error: Database error during request'
	}
	const { errorCode, httpStatusCode } = err

	res.statusCode = httpStatusCode ?? HttpStatusCodes.INTERNAL_SERVER_ERROR
	return res.json({
		error: errorCode ?? 'INTERNAL_SERVER_ERROR',
		message: err.message
	})
}
