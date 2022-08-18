import { Request } from 'express'
import { MailDataRequired } from '@sendgrid/helpers/classes/mail'
export type EmailType = {
	to: string[]
	from: string
	subject: string
	text: string
}
export interface SendEmailRequest extends Request {
	emailType: MailDataRequired
}
export interface IEmailType {
	send(params: MailDataRequired): Promise<MailDataRequired>
}
