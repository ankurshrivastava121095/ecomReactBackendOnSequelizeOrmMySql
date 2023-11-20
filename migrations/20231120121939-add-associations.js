'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add association: Product belongs to Category
    await queryInterface.addColumn('Products', 'productCategory', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id',
      },
    });

    // Add association: Category has many Products
    await queryInterface.addColumn('Categories', 'productCategory', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove associations
    await queryInterface.removeColumn('Products', 'productCategory');
    await queryInterface.removeColumn('Categories', 'productCategory');
  },
};