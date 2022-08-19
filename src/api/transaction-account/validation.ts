import { check } from "express-validator";

export const createTransactionAccountValidation = [
  check('balance').notEmpty().withMessage("Balance is required"),
  check('name').notEmpty().withMessage("Name is required"),
];