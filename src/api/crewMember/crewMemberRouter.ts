import { CrewMemberController } from './crewController'
import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { checkCrewMemberRequest, updateCrewMemberRequest, updateInvitationStatus } from './validation'

const crewController = new CrewMemberController()
export const crewMemberRouter = express.Router()

crewMemberRouter.get('/all-crew-member', authMiddleware, crewController.getAllCrewMember as Application)
crewMemberRouter.post('/invite', authMiddleware, checkCrewMemberRequest, crewController.inviteCrewMember as Application)
crewMemberRouter.get('/:id', authMiddleware, crewController.getCrewMemberById as Application)
crewMemberRouter.put(
	'/update/:id',
	authMiddleware,
	updateCrewMemberRequest,
	crewController.updateCrewMember as Application
)
crewMemberRouter.get('/crew-request', authMiddleware, crewController.listOfCrewRequest as Application)

crewMemberRouter.put(
	'/accept-reject-request',
	authMiddleware,
	updateInvitationStatus,
	crewController.acceptOrRejectInvitation as Application
)

crewMemberRouter.delete('/remove/:id', authMiddleware, crewController.deleteCrewMember as Application)
