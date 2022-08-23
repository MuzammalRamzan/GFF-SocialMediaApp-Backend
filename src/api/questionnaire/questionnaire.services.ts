import { Transaction } from 'sequelize/types'
import { IQuestionnaire, IQuestionnaireAnswer, IQuestionnaireService } from './interface'
import { Questionnaire, QuestionnaireAnswers } from './questionnaire.model'

export class QuestionnaireService implements IQuestionnaireService {
	async createQuestion(params: IQuestionnaire): Promise<Questionnaire> {
		return await Questionnaire.create({ ...params })
	}

	async updateQuestion(params: IQuestionnaire): Promise<Questionnaire> {
		let question = await Questionnaire.update({ ...params }, { where: { id: params.id } })

		return (await Questionnaire.findByPk(params.id)) as Questionnaire
	}

	async getQuestionnaire(role_id: number, withAnswers: boolean, user_id: number): Promise<Questionnaire[]> {
		return await Questionnaire.findAll({
			where: { role_id },
			include: [
				...(withAnswers ? [{ model: QuestionnaireAnswers, as: 'answers', where: { user_id }, required: false }] : [])
			]
		})
	}

	async saveAnswers(params: IQuestionnaireAnswer[] | any, transaction?: Transaction): Promise<void> {
		await QuestionnaireAnswers.bulkCreate(params, { ...(transaction ? { transaction } : {}) })
	}

	async updateAnswers(params: IQuestionnaireAnswer[] | any): Promise<void> {
		await QuestionnaireAnswers.bulkCreate(params, { updateOnDuplicate: ['answer'] })
	}

	async getAnswers(user_id: number): Promise<QuestionnaireAnswers[]> {
		const answers = await QuestionnaireAnswers.findAll({
			where: { user_id }
		})
		return answers
	}
}
