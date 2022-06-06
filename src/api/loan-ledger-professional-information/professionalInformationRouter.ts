import express, { Application } from 'express'
import { LoanLedgerProfessionalInformationController } from './professionalInformationController'

const loanLedgerProfessionalInformationController = new LoanLedgerProfessionalInformationController()
export const loanLedgerProfessionalInformationRouter = express.Router()

loanLedgerProfessionalInformationRouter.get(
	'/list',
	loanLedgerProfessionalInformationController.getAllLoanLedgerProfessionalInformations
)

loanLedgerProfessionalInformationRouter.get(
	'/:id',
	loanLedgerProfessionalInformationController.getLoanLedgerProfessionalInformationById as Application
)

loanLedgerProfessionalInformationRouter.get(
	'/user/:user_id',
	loanLedgerProfessionalInformationController.getLoanLedgerProfessionalInformationByUserId as Application
)

loanLedgerProfessionalInformationRouter.post(
	'/add',
	loanLedgerProfessionalInformationController.createLoanLedgerProfessionalInformation as Application
)

loanLedgerProfessionalInformationRouter.put(
	'/update/:id',
	loanLedgerProfessionalInformationController.updateLoanLedgerProfessionalInformation as Application
)

loanLedgerProfessionalInformationRouter.delete(
	'/delete/:id',
	loanLedgerProfessionalInformationController.deleteLoanLedgerProfessionalInformation as Application
)
