import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { MeetingController } from './meeting.controllers'
import { acceptOrRejectMeetingRequestValidation, createMeetingValidation } from './validation'
import { validateReq } from '../../helper/validationMiddleware'

export const meetingRouter = express.Router()

const controller = new MeetingController()

meetingRouter.get('/', authMiddleware, controller.getMeetings as Application)
meetingRouter.post('/', authMiddleware, createMeetingValidation, validateReq, controller.createMeeting as Application)
meetingRouter.put(
	'/accept',
	authMiddleware,
	acceptOrRejectMeetingRequestValidation,
	validateReq,
	controller.acceptMeetingRequest as Application
)
meetingRouter.put(
	'/reject',
	authMiddleware,
	acceptOrRejectMeetingRequestValidation,
	validateReq,
	controller.rejectMeetingRequest as Application
)
