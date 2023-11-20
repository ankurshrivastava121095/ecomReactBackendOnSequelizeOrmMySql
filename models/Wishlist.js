const { DataTypes, fn } = require('sequelize');
const sequelize = require('../db/sequelizeDB');
const User = require('./User');
const Product = require('./Product');

const Wishlist = sequelize.define('Wishlist', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  productImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: fn('NOW'),
  },
});

User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlists' });
Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Product.hasMany(Wishlist, { foreignKey: 'productId', as: 'wishlists' });
Wishlist.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = Wishlist;