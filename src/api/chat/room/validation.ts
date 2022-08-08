import { check } from 'express-validator'

export const createRoomValidation = [
	check('name').isString().notEmpty().withMessage("Can't be empty"),
	check('user_ids').isArray().notEmpty().withMessage("Can't be empty"),
	check('user_ids.*').isInt().withMessage('Should be an integer')
]
