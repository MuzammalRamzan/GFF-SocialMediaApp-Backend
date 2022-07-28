import { Request } from 'express'
export type EmailType = {
	to: string[]
	from: string
	subject: string
	text: string
}
export interface SendEmailRequest extends Request {
	emailType: EmailType
}
export interface IEmailType {
	send(params: EmailType): Promise<EmailType>
}
