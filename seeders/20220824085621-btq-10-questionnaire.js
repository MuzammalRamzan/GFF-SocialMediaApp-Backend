'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		const questions = [
			'Have you ever served in a war zone, or have you ever served in a noncombat job that exposed you to war-related casualties (for example, as a medic or on graves registration duty?)',
			'Have you ever been in a serious car accident, or a serious accident at work or somewhere else?',
			'Have you ever had a life-threatening illness such as cancer, a heart attack, leukemia, AIDS, multiple sclerosis, etc.?',
			'Before age 18, were you ever physically punished or beaten by a parent, caretaker, or teacher so that: you were very frightened; or you thought you would be injured; or you received bruises, cuts, welts, lumps or other injuries?',
			'Not including any punishments or beatings you already reported in Question 5, have you ever been attacked, beaten, or mugged by anyone, including friends, family members or strangers?',
			'Has anyone ever made or pressured you into having some type of unwanted sexual contact?\nNote: By sexual contact we mean any contact between someone else and your private parts or between you and some else’s private parts',
			'Have you ever been in any other situation in which you were seriously injured, or have you ever been in any other situation in which you feared you might be seriously injured or killed?',
			'Has a close family member or friend died violently, for example, in a serious car crash, mugging, or attack?',
			'Have you ever witnessed a situation in which someone was seriously injured or killed, or have you ever witnessed a situation in which you feared someone would be seriously injured or killed?\nNote: Do not answer “yes” for any event you already reported in Questions 1-9'
		]
		await queryInterface.bulkInsert(
			'questionnaire',
			questions.map((question, rank) => ({ question: question.trim(), rank, type: 'BTQ-10', role_id: '4' }))
		)
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete('questionnaire', { type: 'BTQ-10', role_id: 4 }, {})
	}
}
