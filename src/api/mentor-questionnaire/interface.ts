import { Request } from 'express'
import { Questions } from './questionnaireModel'

type MessagesConst = {
	CREATE_QUESTION: string
	UPDATE_QUESTION: string
	DELETE_QUESTION: string
	GET_ALL_QUESTION: string
	GET_QUESTION: string
	QUESTION_NOT_FOUND: string
	NOT_FOUND: string
	UNAUTHORIZED: string
}

export const Messages: MessagesConst = {
	CREATE_QUESTION: 'Create Question Successfully!',
	UPDATE_QUESTION: 'Update Question Successfully!',
	DELETE_QUESTION: 'Delete Question Successfully!',
	GET_ALL_QUESTION: 'Fetch Questions Successfully!',
	GET_QUESTION: 'Fetch Question Successfully!',
	QUESTION_NOT_FOUND: 'Question not found!',
	NOT_FOUND: 'No data found',
	UNAUTHORIZED: 'Unauthorized'
}

export type QuestionType = {
	id: number
	question: string
}

export interface IQuestionService {
	add(params: string): Promise<Questions>
	list(): Promise<Questions[]>
	fetchById(id: number): Promise<Questions[]>
	update(id: number, params: QuestionType): Promise<Questions>
	delete(id: number): Promise<number>
}

export interface GetQuestionsByUniqueId extends Request {
	QuestionType: QuestionType
}

export interface UpdateQuestionRequest extends Request {
	QuestionType: QuestionType
}

export interface DeleteQuestionRequest extends Request {
	id: number
}
