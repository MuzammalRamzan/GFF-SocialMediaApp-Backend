import { check } from 'express-validator'

export const addFeedbackValidation = [
	check('name').isString().notEmpty().withMessage('Name must be a string.'),
	check('email').isEmail().notEmpty().withMessage('Email must be a string.'),
	check('comment').isString().notEmpty().withMessage('Comment must be a string.')
]
