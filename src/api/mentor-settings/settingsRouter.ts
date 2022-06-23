import express, { Application } from 'express'
import { SettingsController } from './settingsController'

const settingsController = new SettingsController()
export const mentorSettingsRouter = express.Router()

mentorSettingsRouter.get('/industries', settingsController.getAllIndustries)
mentorSettingsRouter.get('/roles', settingsController.getAllRoles)
mentorSettingsRouter.get('/frequencies', settingsController.getAllFrequencies)
mentorSettingsRouter.get('/modes', settingsController.getAllModes)
mentorSettingsRouter.get('/languages', settingsController.getAllLanguages)
