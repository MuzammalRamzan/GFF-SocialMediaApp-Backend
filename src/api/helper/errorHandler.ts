import { ErrorRequestHandler } from 'express'

export enum HttpStatusCodes {
	INTERNAL_SERVER_ERROR = 500
}

export interface ErrorPayload {
	errorCode?: string;
	httpStatusCode?: number;
	finalClosure?: () => Promise<void>;
}

export class GffError extends Error {
	finalClosure?: () => Promise<void>;
	httpStatusCode?: number;
	errorCode?: string;

	constructor(message: string, errorPayload?: ErrorPayload) {
		super(message);
		this.finalClosure = errorPayload?.finalClosure;
		this.httpStatusCode = errorPayload?.httpStatusCode;
		this.errorCode = errorPayload?.errorCode;
		this.name = this.constructor.name;
	}
}


export const jsonErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
	if (typeof err.code === 'string' && (err.code.startsWith('42') || err.code.startsWith('22'))) {
		err.message = 'Internal server error: Database error during request'
	}
	const { errorCode, httpStatusCode } = err as GffError

	res.statusCode = httpStatusCode ?? HttpStatusCodes.INTERNAL_SERVER_ERROR
	return res.json({
		error: errorCode ?? 'INTERNAL_SERVER_ERROR',
		message: err.message,
		code: httpStatusCode ?? HttpStatusCodes.INTERNAL_SERVER_ERROR
	})
}
