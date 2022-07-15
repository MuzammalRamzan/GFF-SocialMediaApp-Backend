import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { UserRoleController } from './userRole.controller'

export const roleRouter = express.Router()
const roleController = new UserRoleController()

roleRouter.get('/', authMiddleware, roleController.getAllRoles as Application)
