import { check } from 'express-validator'

export const transactionBodyValidation = [
	check('amount').exists({ checkFalsy: true }).withMessage("Amount can't not be zero/null/empty.")
]
