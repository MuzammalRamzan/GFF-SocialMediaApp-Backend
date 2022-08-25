import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { ApplyForLoanController } from './applyForLoanController'

const applyForLoanController = new ApplyForLoanController()
export const applyForLoanRouter = express.Router()

applyForLoanRouter.get('/check-eligibility', authMiddleware, applyForLoanController.checkEligibleForLoan as Application)
applyForLoanRouter.post('/', authMiddleware, applyForLoanController.applyForLoan as Application)
applyForLoanRouter.get('/get-loans', authMiddleware, applyForLoanController.getLoans as Application)
