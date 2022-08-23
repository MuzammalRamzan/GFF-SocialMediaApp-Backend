'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.removeColumn('warrior_information', 'price_range')
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.addColumn('warrior_information', 'price_range', {
			type: Sequelize.STRING
		})
	}
}
