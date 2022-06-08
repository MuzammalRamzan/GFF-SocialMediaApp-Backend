import express, { Application } from 'express';
import { authMiddleware } from '../helper/authMiddleware';
import { LoanLedgerPersonalInformationController } from './loanLedgerPersonalInformationController';

const loanLedgerPersonalInformationController = new LoanLedgerPersonalInformationController()
export const loanLedgerPersonalInfoRouter = express.Router();

loanLedgerPersonalInfoRouter.get('/list', loanLedgerPersonalInformationController.getLoanLedgerPersonalInfo)
loanLedgerPersonalInfoRouter.get('/user/:user_id', authMiddleware, loanLedgerPersonalInformationController.getLoanLedgerPersonalInfoByUserId as Application)
loanLedgerPersonalInfoRouter.get('/:id',  authMiddleware, loanLedgerPersonalInformationController.getLoanLedgerPersonalInfoById as Application)
loanLedgerPersonalInfoRouter.post('/add',  authMiddleware, loanLedgerPersonalInformationController.createLoanLedgerPersonalInfo as Application)
loanLedgerPersonalInfoRouter.put('/update/:id',  authMiddleware, loanLedgerPersonalInformationController.updateLoanLedgerPersonalInfo as Application)
loanLedgerPersonalInfoRouter.delete('/delete/:id',  authMiddleware, loanLedgerPersonalInformationController.deleteLoanLedgerPersonalInfo as Application)
