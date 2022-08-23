'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.renameColumn('transaction', 'payed_at', 'paid_at')
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.renameColumn('transaction', 'paid_at', 'payed_at')
	}
}
