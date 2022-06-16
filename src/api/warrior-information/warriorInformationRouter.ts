import express from "express"
import { check } from "express-validator";
import { authMiddleware } from "../helper/authMiddleware";
import { WarriorInformationController } from "./warriorInformationController";

export const warriorInformationRouter = express.Router();

const controller = new WarriorInformationController();

const validation = [
  check('specialty').isArray().notEmpty().withMessage("Specialty is required"),
  check('certification').isArray().notEmpty().withMessage("Certification is required"),
  check('therapy_type').isArray().notEmpty().withMessage("Therapy type is required"),
  check('price_range').isArray().notEmpty().withMessage("Price range is required"),
];

warriorInformationRouter.get('/:user_id', authMiddleware, controller.getByUserId);
warriorInformationRouter.post('/', authMiddleware, validation, controller.create);
warriorInformationRouter.put('/:id', authMiddleware, validation, controller.update);


