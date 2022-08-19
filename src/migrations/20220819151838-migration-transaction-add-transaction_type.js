'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('transaction', 'transaction_type', {
			type: Sequelize.ENUM('income', 'expense'),
			allowNull: true,
			defaultValue: 'expense'
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('transaction', 'transaction_type')
	}
}
