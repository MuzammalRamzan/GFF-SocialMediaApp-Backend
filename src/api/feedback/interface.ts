import { Feedback } from './feedbackModel'

export type FeedbackType = {
	id: number
	name: string
	email: string
	comment: string
}

export type addFeedbackParams = {
	name: string
	email: string
	comment: string
}

export interface IFeedbackService {
	add(params: addFeedbackParams): Promise<Feedback>
}
