import { check } from 'express-validator'

export const createMeetingValidation = [
	check('startTime').isNumeric().notEmpty().withMessage('Start time should be of type Date.'),
	check('endTime').isNumeric().notEmpty().withMessage('End time should be of type Date.'),
	check('participant_id').isInt().notEmpty().withMessage("Participant's id should be an integer."),
	check('isContractSigned').isBoolean().notEmpty().withMessage('isContractSigned should be of type boolean.'),
	check('answers.*.question_id').isInt({ gt: 0 }).notEmpty().withMessage('Invalid question id.'),
	check('answers.*.answer').notEmpty().withMessage('Invalid answer.'),
	check('message').isString().notEmpty().withMessage('Message should be of type string.')
]

export const acceptOrRejectMeetingRequestValidation = [
	check('meeting_id').isInt().notEmpty().withMessage('Meeting id should be an integer')
]
