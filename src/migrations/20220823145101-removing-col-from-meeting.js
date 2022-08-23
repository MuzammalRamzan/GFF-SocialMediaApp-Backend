'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		queryInterface.removeColumn('meeting', 'questioner')
	},

	async down(queryInterface, Sequelize) {
		queryInterface.addColumn('meeting', 'questioner', { type: Sequelize.JSON })
	}
}
