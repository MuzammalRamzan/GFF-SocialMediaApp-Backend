import { check } from 'express-validator'

export const createMeetingValidation = [
	check('startTime').isString().notEmpty().withMessage('Start time should be of type Date.'),
	check('participant_id').isInt().notEmpty().withMessage("Participant's id should be an integer.")
]

export const acceptOrRejectMeetingRequestValidation = [
	check('meeting_id').isInt().notEmpty().withMessage('Meeting id should be an integer')
]
