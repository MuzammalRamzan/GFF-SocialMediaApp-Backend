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
			'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
			'Little interest or pleasure in doing things',
			'Feeling down, depressed, or hopeless',
			'Trouble falling or staying asleep, or sleeping too much',
			'Feeling tired or having little energy',
			'Poor appetite or overeating',
			'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
			'Trouble concentrating on things, such as reading the newspaper or watching television',
			'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
			'Thoughts that you would be better off dead or of hurting yourself in some way '
		]
		await queryInterface.bulkInsert(
			'questionnaire',
			questions.map((question, rank) => ({ question: question.trim(), rank, type: 'PHQ-9', role_id: '4' }))
		)
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete('questionnaire', { type: 'PHQ-9', role_id: 4 }, {})
	}
}
