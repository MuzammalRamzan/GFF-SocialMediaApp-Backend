'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('user', 'first_name', {
			type: Sequelize.STRING,
			allowNull: false
		})
		await queryInterface.addColumn('user', 'last_name', {
			type: Sequelize.STRING,
			allowNull: false
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('user', 'first_name')
		await queryInterface.removeColumn('user', 'last_name')
	}
}
