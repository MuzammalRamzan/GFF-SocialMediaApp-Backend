import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { DashboardController } from './dashboard.controllers'

export const dashboardRouter = express.Router()
const dashboardController = new DashboardController()

dashboardRouter.get('/chart', authMiddleware, dashboardController.getTransactionStatistics as Application)
dashboardRouter.get('/info', authMiddleware, dashboardController.getTransactionInformation as Application)
