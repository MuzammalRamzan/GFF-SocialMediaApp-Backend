'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('warrior_information', 'language', {
			type: Sequelize.STRING
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('warrior_information', 'language')
	}
}
