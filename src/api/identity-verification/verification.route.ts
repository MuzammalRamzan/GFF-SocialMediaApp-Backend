import express from 'express'
import { authMiddleware } from '../helper/authMiddleware'
import { IdentityVerificationController } from './verification.controller'

export const identityVerification = express.Router()

const controller = new IdentityVerificationController()

identityVerification.get('/verification/session', authMiddleware, controller.createSession.bind(controller));
identityVerification.get('/verify/session', authMiddleware, controller.verifySession.bind(controller));
