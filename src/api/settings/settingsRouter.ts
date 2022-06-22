import express, { Application } from 'express'
import { SettingsController } from './settingsController'

const settingsController = new SettingsController()
export const settingsRouter = express.Router()

settingsRouter.get('/industries', settingsController.getAllIndustries)
settingsRouter.get('/roles', settingsController.getAllRoles)
settingsRouter.get('/frequencies', settingsController.getAllFrequencies)
settingsRouter.get('/modes', settingsController.getAllModes)
settingsRouter.get('/languages', settingsController.getAllLanguages)
