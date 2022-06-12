import express, { Application } from 'express';
import { authMiddleware } from '../helper/authMiddleware';
import { MentorInformationController } from './mentorInformationController';

const controller = new MentorInformationController()
export const mentorInformationRouter = express.Router();

mentorInformationRouter.post('/', authMiddleware, controller.createMentorInformation as Application);
mentorInformationRouter.put('/', authMiddleware, controller.updateMentorInformation as Application);
mentorInformationRouter.get('/:mentor_id', authMiddleware, controller.getMentorInformation as Application);