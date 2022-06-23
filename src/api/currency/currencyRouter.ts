import express, { Application } from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { CurrencyController } from './currencyController'

const currencyController = new CurrencyController()
export const currencyRouter = express.Router()

currencyRouter.get('/list', authMiddleware, currencyController.fetchAll)
currencyRouter.get('/:id', authMiddleware, currencyController.fetchById)
currencyRouter.post('/add', authMiddleware, currencyController.addCurrency)
currencyRouter.delete('/delete/:id', authMiddleware, currencyController.deleteCurrency)
