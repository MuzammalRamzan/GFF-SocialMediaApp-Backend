'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.removeColumn('dailyArticle', 'contentBody')
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.addColumn('dailyArticle', 'contentBody', {
			type: Sequelize.TEXT,
			allowNull: false
		})
	}
}
