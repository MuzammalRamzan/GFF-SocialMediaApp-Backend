import express, { Application } from 'express';
import { authMiddleware } from '../helper/authMiddleware';
import { MentorMatcherController } from './mentorMatcherController';
import { requiredMenteeId, requiredMentorId, requiredRequestId, sendMentorRequestValidation } from './validation';

const controller = new MentorMatcherController()
export const mentorMatcherRouter = express.Router();

mentorMatcherRouter.get('/mentors', authMiddleware, controller.findMentors as Application);
mentorMatcherRouter.get('/my-mentor', authMiddleware, controller.myMentors as Application);
mentorMatcherRouter.get('/my-mentee', authMiddleware, controller.myMentees as Application);
mentorMatcherRouter.post('/request/send', authMiddleware, sendMentorRequestValidation, controller.sendMentorRequest as Application);
mentorMatcherRouter.put(
  '/request/accept',
  authMiddleware,
  [
    requiredMenteeId,
    requiredRequestId
  ],
  controller.acceptMentorRequest as Application
);
mentorMatcherRouter.put(
  '/request/reject',
  authMiddleware,
  [
    requiredMenteeId,
    requiredRequestId
  ],
  controller.rejectMentorRequest as Application
);
// get list of received requests
mentorMatcherRouter.get('/request/mentor', authMiddleware, controller.getMentorRequests as Application);
// get list of sent requests
mentorMatcherRouter.get('/request/mentee', authMiddleware, controller.getMentorRequestsByMenteeId as Application);
mentorMatcherRouter.post('/mentor/favorite/add', authMiddleware, requiredMentorId, controller.addMentorToFavorite as Application);
mentorMatcherRouter.post('/mentor/favorite/remove', authMiddleware, requiredMentorId, controller.removeMentorFromFavorite as Application);

mentorMatcherRouter.put('/sign-contract', authMiddleware, requiredRequestId, controller.signContract as Application);
