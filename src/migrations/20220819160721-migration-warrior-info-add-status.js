'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('warrior_information', 'status', {
			type: Sequelize.ENUM('approved', 'pending', 'deactivated'),
			defaultValue: 'pending'
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('warrior_information', 'status')
	}
}
