'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('transaction', 'recurring_status', {
			type: Sequelize.ENUM('active', 'inactive'),
			allowNull: true,
			defaultValue: 'inactive'
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('transaction', 'recurring_status')
	}
}
