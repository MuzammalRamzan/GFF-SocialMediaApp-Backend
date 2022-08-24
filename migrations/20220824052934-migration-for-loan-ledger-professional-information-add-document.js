'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const TABLE_NAME = 'loan_ledger_professional_information'

    await queryInterface.addColumn(TABLE_NAME, 'document_url', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  async down(queryInterface, Sequelize) {
    const TABLE_NAME = 'loan_ledger_professional_information'

    await queryInterface.removeColumn(TABLE_NAME, 'document_url')
  }
}
