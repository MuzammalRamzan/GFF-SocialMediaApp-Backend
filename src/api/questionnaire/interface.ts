import { Transaction } from 'sequelize/types'
import { Questionnaire, QuestionnaireAnswers } from './questionnaire.model'

export enum QuestionType {
	SRQ_20 = 'SRQ-20',
	PHQ_9 = 'PHQ-9',
	GAD_7 = 'GAD-7',
	BTQ_10 = 'BTQ-10'
}

export interface IQuestionnaire {
	id?: number
	question: string
	role_id: number
	type: QuestionType
}

export interface IQuestionnaireAnswer {
	id?: number
	question_id: number
	answer: number
	meeting_id?: number
	user_id?: number
}

export interface IQuestionnaireService {
	createQuestion(params: IQuestionnaire): Promise<Questionnaire>
	updateQuestion(params: IQuestionnaire): Promise<Questionnaire>
	getQuestionnaire(): Promise<Questionnaire[]>
	saveAnswers(params: IQuestionnaireAnswer[], transaction?: Transaction): Promise<void>
	updateAnswers(params: IQuestionnaireAnswer[]): Promise<void>
	getAnswers(meeting_id: number): Promise<QuestionnaireAnswers[]>
}
