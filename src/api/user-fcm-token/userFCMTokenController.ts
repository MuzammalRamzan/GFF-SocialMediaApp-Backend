import { NextFunction, Response } from 'express'

import { UserFCMTokenService } from './userFCMTokenService'
import { FCMTokenRequest, Messages } from './interface'

export class UserFCMTokenController {
	private readonly userFCMTokenService: UserFCMTokenService

	constructor() {
		this.userFCMTokenService = new UserFCMTokenService()
	}

	addFcmToken = async (req: FCMTokenRequest, res: Response, next: NextFunction) => {
		try {
			const userId = +req.user?.id as number
			const token = req.body.token as string
			const user = await this.userFCMTokenService.addFcmToken(userId, token);
			return res.status(200).json({ data:  user , code: 200, message: 'OK' })
		} catch (err) {
			next(err)
		}
	}

	deleteFcmToken = async (req: FCMTokenRequest, res: Response, next: NextFunction) => {
		try {
			const userId = +req.user?.id as number
			const token = req.body.token as string
			await this.userFCMTokenService.deleteFcmToken(userId, token);
			return res.status(200).json({ data:  {} , code: 200, message: Messages.TOKEN_DELETED })
		} catch (err) {
			next(err)
		}
	}
}
