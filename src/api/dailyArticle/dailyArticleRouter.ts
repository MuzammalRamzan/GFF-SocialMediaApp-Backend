import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { DailyArticleController } from './dailyArticleController'
import multer from 'multer'

const dailyArticleController = new DailyArticleController()
export const dailyArticleRouter = express.Router()

dailyArticleRouter.post('/add', authMiddleware, multer().single('Image'), dailyArticleController.createArticle as Application)
dailyArticleRouter.get('/getByCategory', authMiddleware, dailyArticleController.getByCategory as Application)
dailyArticleRouter.put(
	'/update/:id',
	authMiddleware,
	multer().single('Image'),
	dailyArticleController.updateArticle as Application
)
dailyArticleRouter.delete('/delete/:id', authMiddleware, dailyArticleController.deleteArticle as Application)
