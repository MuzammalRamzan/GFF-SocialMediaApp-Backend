import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { MeetingController } from './meeting.controllers'
import { acceptMeetingRequestValidation, createMeetingValidation, rejectMeetingRequestValidation } from './validation'
import { validateReq } from '../../helper/validationMiddleware'

export const meetingRouter = express.Router()

const controller = new MeetingController()

meetingRouter.get('/', authMiddleware, controller.getMeetings as Application)
meetingRouter.get('/past', authMiddleware, controller.getPastMeetings as Application)
meetingRouter.post('/', authMiddleware, createMeetingValidation, validateReq, controller.createMeeting as Application)
meetingRouter.put(
	'/accept',
	authMiddleware,
	acceptMeetingRequestValidation,
	validateReq,
	controller.acceptMeetingRequest as Application
)
meetingRouter.put(
	'/reject',
	authMiddleware,
	rejectMeetingRequestValidation,
	validateReq,
	controller.rejectMeetingRequest as Application
)
