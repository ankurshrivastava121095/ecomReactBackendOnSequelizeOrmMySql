'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change the datatype of the phone column to BIGINT
    await queryInterface.changeColumn('Users', 'phone', {
      type: Sequelize.BIGINT,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes if needed
    await queryInterface.changeColumn('Users', 'phone', {
      type: Sequelize.INTEGER, // Change it back to INTEGER if needed
      allowNull: true,
    });
  },
};