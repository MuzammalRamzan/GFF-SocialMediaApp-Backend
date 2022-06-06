import express, { Application } from 'express';
import { LoanLedgerPersonalInformationController } from './loanLedgerPersonalInformationController';

const loanLedgerPersonalInformationController = new LoanLedgerPersonalInformationController()
export const loanLedgerPersonalInfoRouter = express.Router();

loanLedgerPersonalInfoRouter.get('/list', loanLedgerPersonalInformationController.getLoanLedgerPersonalInfo)
loanLedgerPersonalInfoRouter.get('/user/:user_id', loanLedgerPersonalInformationController.getLoanLedgerPersonalInfoByUserId as Application)
loanLedgerPersonalInfoRouter.get('/:id', loanLedgerPersonalInformationController.getLoanLedgerPersonalInfoById as Application)
loanLedgerPersonalInfoRouter.post('/add', loanLedgerPersonalInformationController.createLoanLedgerPersonalInfo as Application)
loanLedgerPersonalInfoRouter.put('/update/:id', loanLedgerPersonalInformationController.updateLoanLedgerPersonalInfo as Application)
loanLedgerPersonalInfoRouter.delete('/delete/:id', loanLedgerPersonalInformationController.deleteLoanLedgerPersonalInfo as Application)
