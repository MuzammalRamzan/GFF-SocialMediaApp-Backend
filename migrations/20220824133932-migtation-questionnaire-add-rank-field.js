'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		const table = await queryInterface.describeTable('questionnaire')
		if (!table.rank) {
			await queryInterface.addColumn('questionnaire', 'rank', { type: Sequelize.INTEGER })
		}
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('questionnaire', 'rank')
	}
}
