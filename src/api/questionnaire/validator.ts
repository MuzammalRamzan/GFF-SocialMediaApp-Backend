import { check, param } from 'express-validator'
import { QuestionType } from './interface'

export const createQuestionValidator = [
	check('question').isString().notEmpty().withMessage("Question can't be empty/null"),
	check('role_id').isInt({ min: 1, gt: 0 }).withMessage('Invalid role_id'),
	check('type').notEmpty().isIn(Object.values(QuestionType)).withMessage('Invalid question type')
]

export const questionnaireIdExistInParams = [
	param('id').exists().isInt({ gt: 0 }).toInt().withMessage('Invalid question id in request param.')
]

export const saveOrUpdateAnswersValidator = [
	check('answers.*.question_id').isInt({ gt: 0 }).notEmpty().withMessage('Invalid question_id'),
	check('answers.*.answer').isInt({ gt: -1, lt: 5 }).notEmpty().withMessage('Invalid answer')
]

export const updateAnswers = [check('answers.*.id').isInt({ gt: 0 }).notEmpty().withMessage('Invalid answer id')]

export const roleIdExistInParams = [
	param('role_id').exists().isInt({ gt: 0, lt: 5 }).toInt().withMessage('Invalid role id in request param')
]
