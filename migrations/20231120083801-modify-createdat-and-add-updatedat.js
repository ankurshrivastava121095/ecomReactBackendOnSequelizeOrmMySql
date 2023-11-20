'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the allowNull: false constraint from createdAt
    await queryInterface.changeColumn('Users', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.fn('NOW'),
    });

    // Add the new column updatedAt
    await queryInterface.changeColumn('Users', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.fn('NOW'),
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes if needed
    await queryInterface.changeColumn('Users', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.fn('NOW'),
    });

    // Remove the updatedAt column
    await queryInterface.changeColumn('Users', 'updatedAt');
  },
};