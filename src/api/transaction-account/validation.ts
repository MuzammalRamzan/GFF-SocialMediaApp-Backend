import { check } from "express-validator";

export const createTransactionAccountValidation = [
  check('balance').notEmpty().withMessage("Balance is required"),
  check('account_type_id').notEmpty().withMessage("Account type is required"),
  check('name').notEmpty().withMessage("Name is required"),
];