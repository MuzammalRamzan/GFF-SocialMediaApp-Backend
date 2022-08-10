import { body, check } from 'express-validator'

export const createPaymentRequestValidation = [
	body('token').exists().isString().withMessage('Token is required!'),
	body('amount').exists().isString().withMessage('Amount is required!'),
	body('serviceProviderId').exists().isNumeric().withMessage('Service provider id is required!')
]
