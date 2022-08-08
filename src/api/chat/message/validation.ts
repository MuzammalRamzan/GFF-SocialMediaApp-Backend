import { check } from 'express-validator'

export const sendMessageValidation = [check('message').isString().notEmpty().withMessage("Can't be empty!")]

export const markMessagesAsSeenValidation = [
	check('messageIds').isArray().notEmpty().withMessage("Can't be empty"),
	check('messageIds.*').isInt().withMessage('Should be integer only')
]
