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
			'Feeling nervous, anxious, or on edge',
			'Not being able to stop or control worrying',
			'Worrying too much about different things',
			'Feeling afraid as if something awful might happen',
			'Ask the patient: how difficult have these problems made it to do work, take care of things at home, or get along with other people?'
		]
		await queryInterface.bulkInsert(
			'questionnaire',
			questions.map((question, rank) => ({ question: question.trim(), rank, type: 'GAD-7', role_id: '4' }))
		)
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete('questionnaire', { type: 'GAD-7', role_id: 4 }, {})
	}
}
