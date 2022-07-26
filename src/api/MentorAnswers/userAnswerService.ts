import { IAnswers, IQuestionService, QuestionType } from './interface'
import { Questions } from '../Questionnaire/questionnaireModel'
import { MentorAnswers } from './userAnswerModel'
import { Optional } from 'sequelize/types'

export class QuestionService implements IQuestionService {
	async list(): Promise<Questions[]> {
		const getAllQuestions = await Questions.findAll()

		return getAllQuestions
	}

	async deleteAll(id: number): Promise<number> {
		const deleteQuestions = await MentorAnswers.destroy({ where: { user_id: id } })

		return deleteQuestions
	}

	async createAll(answersArray: IAnswers[] | any): Promise<Questions[]> {
		const deleteQuestions = await MentorAnswers.bulkCreate(answersArray)

		return deleteQuestions
	}
}
