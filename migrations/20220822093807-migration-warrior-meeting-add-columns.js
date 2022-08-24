'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('meeting', 'questioner', {
			type: Sequelize.JSON,
			allowNull: true
		})
		await queryInterface.addColumn('meeting', 'isContractSigned', {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('meeting', 'questioner')
		await queryInterface.removeColumn('meeting', 'isContractSigned')
	}
}
