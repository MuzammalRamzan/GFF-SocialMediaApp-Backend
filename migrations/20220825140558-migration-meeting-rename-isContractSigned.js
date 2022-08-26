'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.renameColumn('meeting', 'isContractSigned', 'isContractSignedByWarrior')
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.renameColumn('meeting', 'isContractSignedByWarrior', 'isContractSigned')
	}
}
