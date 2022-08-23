'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('warrior_information', 'hourly_rate', {
			type: Sequelize.INTEGER
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('warrior_information', 'hourly_rate')
	}
}
