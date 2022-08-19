'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn('transaction', 'status', {
			type: Sequelize.ENUM('Active', 'Inactive', 'Deleted', 'Paid'),
			allowNull: true,
			defaultValue: 'Paid'
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.changeColumn('transaction', 'status', {
			type: Sequelize.ENUM('Active', 'Inactive', 'Deleted'),
			allowNull: true
		})
	}
}
