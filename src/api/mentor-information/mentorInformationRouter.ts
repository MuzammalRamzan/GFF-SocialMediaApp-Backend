import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { MentorInformationController } from './mentorInformationController'

const controller = new MentorInformationController()
export const mentorInformationRouter = express.Router()

mentorInformationRouter.get('/', authMiddleware, controller.getAllMentors as Application)
mentorInformationRouter.get('/:id', authMiddleware, controller.getMentorInformation as Application)
mentorInformationRouter.post('/', authMiddleware, controller.createMentorInformation as Application)
mentorInformationRouter.put('/', authMiddleware, controller.updateMentorInformation as Application)
