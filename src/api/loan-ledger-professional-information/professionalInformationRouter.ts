import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { LoanLedgerProfessionalInformationController } from './professionalInformationController'

const loanLedgerProfessionalInformationController = new LoanLedgerProfessionalInformationController()
export const loanLedgerProfessionalInformationRouter = express.Router()

loanLedgerProfessionalInformationRouter.get(
	'/list',
	loanLedgerProfessionalInformationController.getAllLoanLedgerProfessionalInformations
)

loanLedgerProfessionalInformationRouter.get(
	'/:id', authMiddleware,
	loanLedgerProfessionalInformationController.getLoanLedgerProfessionalInformationById as Application
)

loanLedgerProfessionalInformationRouter.get(
	'/user/:user_id', authMiddleware,
	loanLedgerProfessionalInformationController.getLoanLedgerProfessionalInformationByUserId as Application
)

loanLedgerProfessionalInformationRouter.post(
	'/add', authMiddleware,
	loanLedgerProfessionalInformationController.createLoanLedgerProfessionalInformation as Application
)

loanLedgerProfessionalInformationRouter.put(
	'/update/:id', authMiddleware,
	loanLedgerProfessionalInformationController.updateLoanLedgerProfessionalInformation as Application
)

loanLedgerProfessionalInformationRouter.delete(
	'/delete/:id', authMiddleware,
	loanLedgerProfessionalInformationController.deleteLoanLedgerProfessionalInformation as Application
)
