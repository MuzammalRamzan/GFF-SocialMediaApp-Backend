import { IQuestionService, QuestionType } from './interface'
import { Questions } from './questionnaireModel'

export class QuestionService implements IQuestionService {
	async add(question: string): Promise<Questions> {
		const createQuestion = await Questions.create({
			question
		})
		return createQuestion
	}

	async list(): Promise<Questions[]> {
		const getAllQuestions = await Questions.findAll()

		return getAllQuestions
	}

	async fetchById(id: number): Promise<Questions[]> {
		const getQuestion = await Questions.findAll({
			where: {
				id
			}
		})

		return getQuestion
	}

	async update(id: number, params: QuestionType): Promise<Questions> {
		let questionText = params.question

		const question = await Questions.findOne({
			where: {
				id
			}
		})

		if (question) {
			await question.update({
				question: questionText
			})
		}

		return question as Questions
	}

	async delete(id: number): Promise<number> {
		const deletedRow = await Questions.destroy({
			where: {
				id: id
			}
		})

		return deletedRow
	}
}
