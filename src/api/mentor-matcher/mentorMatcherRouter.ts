import express, { Application } from 'express';
import { authMiddleware } from '../helper/authMiddleware';
import { MentorMatcherController } from './mentorMatcherController';

const controller = new MentorMatcherController()
export const mentorMatcherRouter = express.Router();

mentorMatcherRouter.get('/mentors', controller.findMentors as Application);
mentorMatcherRouter.get('/my-mentor', authMiddleware, controller.myMentors as Application);
mentorMatcherRouter.get('/request/send', authMiddleware, controller.sendMentorRequest as Application);
mentorMatcherRouter.get('/request/accept', authMiddleware, controller.acceptMentorRequest as Application);
mentorMatcherRouter.get('/request/reject', authMiddleware, controller.rejectMentorRequest as Application);



// find all mentors
// mark as favorite/unfavorite mentor
// send request to mentor
// check all sent mentor requests
// accept/reject mentor request
// check all received mentor requests