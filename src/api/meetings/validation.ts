import { check } from 'express-validator'

export const createMeetingValidation = [
	check('startTime').isString().notEmpty().withMessage('Start time should be of type Date.'),
	check('endTime').isString().notEmpty().withMessage('End time should be of type Date.'),
	check('participant_id').isInt().notEmpty().withMessage("Participant's id should be an integer."),
	check('isContractSigned').isBoolean().notEmpty().withMessage('isContractSigned should be of type boolean.'),
	check('answers.*.question_id').isInt({ gt: 0 }).notEmpty().withMessage('Invalid question id.'),
	check('answers.*.answer').isInt({ min: 0, max: 4 }).notEmpty().withMessage('Invalid answer.')
]

export const acceptOrRejectMeetingRequestValidation = [
	check('meeting_id').isInt().notEmpty().withMessage('Meeting id should be an integer')
]
