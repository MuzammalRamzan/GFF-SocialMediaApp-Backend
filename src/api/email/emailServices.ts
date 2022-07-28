import { IEmailType, EmailType } from './interface'
import sgMail from '@sendgrid/mail'
import { bool } from 'aws-sdk/clients/signer'
import { string } from '@hapi/joi'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')
export class EmailTypeServices implements IEmailType {
	async send(params: EmailType): Promise<EmailType> {
		try {
			let resposne = await sgMail.sendMultiple(params)
			return params
		} catch (error) {
			console.log('error', error)

			throw new Error(`${error}`)
		}
	}
}
