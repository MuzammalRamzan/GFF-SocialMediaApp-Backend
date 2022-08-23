'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn('transaction', 'due_date', {
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue: Sequelize.fn('now')
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.changeColumn('transaction', 'due_date', {
			type: Sequelize.DATE,
			allowNull: true
		})
	}
}
