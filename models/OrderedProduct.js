const { DataTypes, fn } = require('sequelize');
const sequelize = require('../db/sequelizeDB');
const Order = require('./Order');
const User = require('./User');

const OrderedProduct = sequelize.define('OrderedProduct', {
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  productDetail: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Confirm',
  },
  isShipped: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  shipmentDate: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  isOutForDelivery: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  outForDeliveryDate: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  isDelivered: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  deliveryDate: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  isCancelled: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  cancellationDate: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: fn('NOW'),
  },
});

User.hasMany(OrderedProduct, { foreignKey: 'userId', as: 'orderedProducts' });
OrderedProduct.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.hasMany(OrderedProduct, { foreignKey: 'orderId', as: 'orderedProducts' });
OrderedProduct.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

module.exports = OrderedProduct;