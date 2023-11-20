'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the existing columns
    await queryInterface.removeColumn('Products', 'productImagePublicId');
    await queryInterface.removeColumn('Products', 'productImageUrl');

    // Add the new column
    await queryInterface.addColumn('Products', 'productImage', {
      type: Sequelize.JSON,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes if needed
    await queryInterface.addColumn('Products', 'productImagePublicId', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('Products', 'productImageUrl', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Remove the new column
    await queryInterface.removeColumn('Products', 'productImage');
  },
};