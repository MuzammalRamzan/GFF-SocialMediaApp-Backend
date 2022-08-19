'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.removeColumn('transaction_account', 'account_type_id')
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.addColumn('transaction_account', 'account_type_id', {
			type: Sequelize.STRING,
			defaultValue: null,
			allowNull: true
		})
	}
}
