import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { MpesaController } from './mpesaController'

export const mpesaRouter = express.Router()
const mpesaController = new MpesaController()

mpesaRouter.get('/auth', authMiddleware, mpesaController.fetch as Application)