'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('dailyDose', 'created_at', {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.fn('now')
		})

		await queryInterface.addColumn('dailyDose', 'isInternalLink', {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('dailyDose', 'created_at')
		await queryInterface.removeColumn('dailyDose', 'isInternalLink')
	}
}
