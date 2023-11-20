const { DataTypes, fn } = require('sequelize');
const sequelize = require('../db/sequelizeDB');
const Product = require('./Product');

const Category = sequelize.define('Category', {
  categoryName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryImage: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: fn('NOW'),
  },
});

module.exports = Category;