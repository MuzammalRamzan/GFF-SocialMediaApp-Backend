import { IEmailType, EmailType, SendEmailRequest } from './interface'
import { Request, Response, NextFunction } from 'express'
import { EmailTypeServices } from './emailServices'

export class EmailController {
	private readonly emailServices: EmailTypeServices

	constructor() {
		this.emailServices = new EmailTypeServices()
	}
	sendEmail = async (req: SendEmailRequest, res: Response, next: NextFunction) => {
		const params = req.body
		try {
			const emailInfo = await this.emailServices.send(params)
			return res.status(200).json({ data: emailInfo, code: 200, message: 'Email sent sucessfully' })
		} catch (err) {
			next(err)
		}
	}
}
