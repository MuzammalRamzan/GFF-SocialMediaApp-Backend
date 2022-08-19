import express, { Application } from 'express'
import { WorldController } from './worldController'

const worldController = new WorldController()
export const worldRouter = express.Router()

worldRouter.get('/countries', worldController.countries as Application)
worldRouter.get('/regions', worldController.regions as Application)
worldRouter.get('/cities', worldController.cities as Application)
