import express, { Application } from 'express'
import multer from 'multer'
import { authMiddleware } from '../helper/authMiddleware'
import { UploadController } from './uploadController'

export const uploadRouter = express.Router()
const uploadController = new UploadController()

uploadRouter.post('/avatar', authMiddleware, multer().single('avatar'), uploadController.uploadAvatar as Application)
uploadRouter.get('/file', uploadController.getFile.bind(uploadController) as Application)