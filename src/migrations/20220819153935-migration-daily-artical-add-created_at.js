'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('dailyArticle', 'created_at', {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.fn('now')
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('dailyArticle', 'created_at')
	}
}
