import { body, check } from 'express-validator'
export const checkCatergory = [
	check('category')
		.isString()
		.notEmpty()
		.isIn(['news', 'music', 'wise-words'])
		.withMessage('The category type should be news, music or wise-words')
]
