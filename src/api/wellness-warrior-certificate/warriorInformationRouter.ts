import express from 'express'
import { body, check } from 'express-validator'
import multer from 'multer'
import { adminMiddleware } from '../helper/AdminMiddleware'
import { authMiddleware } from '../helper/authMiddleware'
import { WarriorInformationController } from './warriorInformationController'

export const warriorCertificateRouter = express.Router()

const controller = new WarriorInformationController()

const validation = [
	check('authority').isString().notEmpty().withMessage('Authority is required'),
	check('title').isString().notEmpty().withMessage('Title is required'),
	check('year').isNumeric().notEmpty().withMessage('Year is required')
]

warriorCertificateRouter.post('/create', authMiddleware, multer().single('pdfFile'), validation, controller.create)
warriorCertificateRouter.get('/:id', authMiddleware, controller.findById)
warriorCertificateRouter.get('/wellness-warrior/:id', authMiddleware, controller.getAllWarriorsCertificates)
warriorCertificateRouter.put('/update/:id', authMiddleware, multer().single('pdfFile'), controller.update)
warriorCertificateRouter.delete('/delete/:id', authMiddleware, controller.delete)
