const { DataTypes, fn } = require('sequelize');
const sequelize = require('../db/sequelizeDB');
const Category = require('./Category');

const Product = sequelize.define('Product', {
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productCategory: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id',
    },
  },
  productImage: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  productPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  productQuantity: {
    type: DataTypes.INTEGER,
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

Category.hasMany(Product, { foreignKey: 'productCategory', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'productCategory', as: 'category' });

module.exports = Product;