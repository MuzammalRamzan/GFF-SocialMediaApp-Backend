import express from "express"
import { check } from "express-validator";
import { authMiddleware } from "../helper/authMiddleware";
import { WellnessWarriorController } from "./wellnessWarriorController";

export const warriorRouter = express.Router();

const controller = new WellnessWarriorController();

warriorRouter.get('/search', authMiddleware, controller.searchWellnessWarriors);
warriorRouter.post('/send-request', authMiddleware, controller.sendRequest);
warriorRouter.post('/approve-request', authMiddleware, controller.approveRequest);
warriorRouter.post('/reject-request', authMiddleware, controller.rejectRequest);
warriorRouter.get('/request/:request_id', authMiddleware, controller.getRequest);
warriorRouter.get('/all-request', authMiddleware, controller.getAllRequests);
warriorRouter.get('/all-sended-request', authMiddleware, controller.getAllSendedRequests);
warriorRouter.post('/favorite-warrior', authMiddleware, controller.favoriteWellnessWarrior);
warriorRouter.post('/unfavorite-warrior', authMiddleware, controller.unfavoriteWellnessWarrior);
warriorRouter.get('/all-favorite-warrior', authMiddleware, controller.getFavoriteWellnessWarriors);

