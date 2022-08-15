import { body, check } from 'express-validator'

export const checkCrewMemberRequest = [
	body('crew_id').isNumeric().notEmpty().withMessage('Crew id required'),
	body('user_id').isNumeric().notEmpty().withMessage('User id required')
]
export const updateCrewMemberRequest = [
	body('crew_id').isNumeric().notEmpty().withMessage('Crew id required'),
	body('user_id').isNumeric().notEmpty().withMessage('User id required'),
	body('status')
		.isString()
		.isIn(['invited', 'accepted', 'rejected'])
		.withMessage('The status type should be invited, accepted, rejected'),
	body('role').isString().isIn(['owner', 'member']).withMessage('The role type should be owner, member')
]

export const updateInvitationStatus = [
	body('crew_id').isNumeric().notEmpty().withMessage('Crew id required'),
	body('status').isString().isIn(['accepted', 'rejected']).withMessage('The status type should be accepted, rejected')
]
