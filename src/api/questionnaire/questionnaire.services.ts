import { Transaction } from 'sequelize/types'
import { IQuestionnaire, IQuestionnaireAnswer, IQuestionnaireService } from './interface'
import { Questionnaire, QuestionnaireAnswers } from './questionnaire.model'

export class QuestionnaireService implements IQuestionnaireService {
	static groupTheQuestionAnswersByType(questions: any) {
		return questions.reduce((acc: any, question: any) => {
			if (acc[question.type]) {
				acc[question.type].push(question)
			} else {
				acc[question.type] = [question]
			}
			return acc
		}, {});
	}

	static filterAnswerObject(answer: any): any {
		return {
			question_id: answer.question_id,
			answer: answer.answer,
			user_id: answer.user_id || null,
			meeting_id: answer.meeting_id || null,
			question: answer?.question?.question || null,
		}
	}

	async createQuestion(params: IQuestionnaire): Promise<Questionnaire> {
		return await Questionnaire.create({ ...params })
	}

	async updateQuestion(params: IQuestionnaire): Promise<Questionnaire> {
		let question = await Questionnaire.update({ ...params }, { where: { id: params.id } })

		return (await Questionnaire.findByPk(params.id)) as Questionnaire
	}

	async getQuestionnaire(): Promise<Questionnaire[]> {
		const questions = await Questionnaire.findAll({
			attributes: { exclude: ['role_id'] }
		});

		return QuestionnaireService.groupTheQuestionAnswersByType(questions);
	}

	async saveAnswers(params: IQuestionnaireAnswer[] | any, transaction?: Transaction): Promise<void> {
		await QuestionnaireAnswers.bulkCreate(params, { ...(transaction ? { transaction } : {}) })
	}

	async updateAnswers(params: IQuestionnaireAnswer[] | any): Promise<void> {
		await QuestionnaireAnswers.bulkCreate(params, { updateOnDuplicate: ['answer'] })
	}

	async getAnswers(roomId: number): Promise<QuestionnaireAnswers[]> {
		const answers = await QuestionnaireAnswers.findAll({
			where: { meeting_id: roomId },
			include: [
				{
					model: Questionnaire,
					attributes: ['question', 'type'],
					as: 'question',
					required: true,
					foreignKey: 'question_id',
				}
			]
		})
		const filteredAnswer = answers.map((answer: any) => {
			return {
				...answer.get(),
				question: answer.get('question').question,
				type: answer.get('question').type
			}
		});

		return QuestionnaireService.groupTheQuestionAnswersByType(filteredAnswer);
	}
}
