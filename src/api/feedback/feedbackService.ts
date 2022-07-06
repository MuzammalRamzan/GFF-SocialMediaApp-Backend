import { Feedback } from './feedbackModel'
import { addFeedbackParams, IFeedbackService } from './interface'

export class FeedbackService implements IFeedbackService {
	async add(params: addFeedbackParams): Promise<Feedback> {
		const feedback = await Feedback.create(params)
		return feedback
	}
}
