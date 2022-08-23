import { Questions } from '../mentor-questionnaire/questionnaireModel'
import { Request } from 'express'

type MessagesConst = {
	GIVE_ALL_ANSWER: string
	SUBMIT_ANSWER: string
	NOT_FOUND: string
	UNAUTHORIZED: string
}

export const Messages: MessagesConst = {
	GIVE_ALL_ANSWER: 'API accepts only fully answered questionnaire!',
	SUBMIT_ANSWER: 'Answers Submitted successfully!',
	NOT_FOUND: 'No data found',
	UNAUTHORIZED: 'Unauthorized'
}

export type QuestionType = {
	id: number
	question: string
}

export interface IQuestionService {
	list(): Promise<Questions[]>
	deleteAll(id: number): Promise<number>
	createAll(answersArray: any[]): Promise<Questions[]>
}

export interface IAnswers {
	question_id: number
	answer: string
	user_id?: number
}
