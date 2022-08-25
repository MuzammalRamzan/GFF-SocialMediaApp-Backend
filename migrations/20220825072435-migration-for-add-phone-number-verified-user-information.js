'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const TABLE_NAME = 'user_information'

    await queryInterface.addColumn(TABLE_NAME, 'phone_number_verified', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    })
  },

  async down(queryInterface, Sequelize) {
    const TABLE_NAME = 'user_information'

    await queryInterface.removeColumn(TABLE_NAME, 'phone_number_verified')
  }
};
