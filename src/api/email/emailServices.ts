import { IEmailType } from './interface'
import sgMail from '@sendgrid/mail'
import { MailDataRequired } from '@sendgrid/helpers/classes/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')
export class EmailTypeServices implements IEmailType {
	async send(params: MailDataRequired): Promise<MailDataRequired> {
		try {
			let resposne = await sgMail.sendMultiple(params)
			return params
		} catch (error) {
			console.log('error', error)

			throw new Error(`${error}`)
		}
	}
}
