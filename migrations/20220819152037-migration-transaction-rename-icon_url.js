'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.renameColumn('transaction_category', 'icon_url', 'icon_id')
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.renameColumn('transaction_category', 'icon_id', 'icon_url')
	}
}
