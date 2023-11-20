const { DataTypes, fn } = require('sequelize');
const sequelize = require('../db/sequelizeDB');
const User = require('./User'); // Import the User model

const Order = sequelize.define('Order', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  shippingInfo: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  subTotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  deliveryCharge: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  grandTotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: fn('NOW'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: fn('NOW'),
  },
});

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Order;