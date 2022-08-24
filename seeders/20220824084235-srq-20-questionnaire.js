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
			'Do you often have headaches?',
			'Is your appetite poor?',
			'Do you sleep badly?',
			'Are you easily frightened?',
			'Do your hands shake?',
			'Do you feel nervous, tense and worried?',
			'Is your digestion poor?',
			'Do you have trouble thinking clearly?',
			'Do you feel unhappy?',
			'Do you cry more than usual?',
			'Do you find it difficult to enjoy your daily activities?',
			'Do you find it difficult to make decisions?',
			'Are you unable to play a useful part in life?',
			'Have you lost interest in things?',
			'Do you feel that you are a worthless person?',
			'Has the thought of ending your life been on your mind?',
			'Do you feel tired all the time?',
			'Do you have uncomfortable feelings in your stomach?',
			'Are you easily tired?'
		]
		await queryInterface.bulkInsert(
			'questionnaire',
			questions.map((question, rank) => ({ question: question.trim(), type: 'SRQ-20', rank, role_id: '4' }))
		)
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete('questionnaire', { type: 'SRQ-20', role_id: 4 }, {})
	}
}
