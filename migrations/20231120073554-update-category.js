'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the existing columns
    await queryInterface.removeColumn('Categories', 'categoryImagePublicId');
    await queryInterface.removeColumn('Categories', 'categoryImageUrl');

    // Add the new column
    await queryInterface.addColumn('Categories', 'categoryImage', {
      type: Sequelize.JSON,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes if needed
    await queryInterface.addColumn('Categories', 'categoryImagePublicId', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('Categories', 'categoryImageUrl', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Remove the new column
    await queryInterface.removeColumn('Categories', 'categoryImage');
  },
};