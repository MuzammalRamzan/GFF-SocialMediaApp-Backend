'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		const TABLE_NAME = 'user_information'

		await queryInterface.addColumn(TABLE_NAME, 'braintree_customer_id', {
			type: Sequelize.STRING,
			allowNull: true
		})
	},

	async down(queryInterface, Sequelize) {
		const TABLE_NAME = 'user_information'

		await queryInterface.removeColumn(TABLE_NAME, 'braintree_customer_id')
	}
}
