'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		const TABLE_NAME = 'user'

		await queryInterface.addColumn(TABLE_NAME, 'promoted_till', {
			type: Sequelize.DATE,
			defaultValue: null
		})

		await queryInterface.addColumn(TABLE_NAME, 'forgot_password_token', {
			type: Sequelize.STRING,
			defaultValue: null
		})

		await queryInterface.addColumn(TABLE_NAME, 'is_pro', {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		})
	},

	async down(queryInterface, Sequelize) {
		const TABLE_NAME = 'user'

		await queryInterface.removeColumn(TABLE_NAME, 'promoted_till')
		await queryInterface.removeColumn(TABLE_NAME, 'forgot_password_token')
		await queryInterface.removeColumn(TABLE_NAME, 'is_pro')
	}
}
