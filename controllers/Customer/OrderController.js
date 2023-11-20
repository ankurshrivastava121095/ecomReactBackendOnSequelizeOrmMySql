const { Op } = require('sequelize');
const Order = require('../../models/Order');
const OrderedProduct = require('../../models/OrderedProduct');

class OrderController {
  static orderPlaced = async (req, res) => {
    try {
      const { userId, shippingInfo, otherData } = req.body;
      const userID= parseInt(userId, 10);

      const order = await Order.create({
        userId: userID,
        shippingInfo: {
          name: shippingInfo.name,
          email: shippingInfo.email,
          userName: shippingInfo.userName,
          phone: shippingInfo.phone,
          city: shippingInfo.city,
          state: shippingInfo.state,
          country: shippingInfo.country,
          postalCode: shippingInfo.postalCode,
          address: shippingInfo.address,
        },
        subTotal: otherData.subTotal,
        discount: otherData.discount,
        deliveryCharge: otherData.deliveryCharge,
        grandTotal: otherData.grandTotal,
        paymentMode: otherData.paymentMode,
      });

      for (const product of otherData.productData) {
        const productID= parseInt(product.productId, 10);
        await OrderedProduct.create({
          userId: userID,
          orderId: order.id,
          productDetail: {
            productId: productID,
            productName: product.productName,
            productPrice: product.productPrice,
            productQuantity: product.quantity,
            productImage: product.productImage,
          },
        });
      }

      res.status(201).json({ status: 'success', message: 'Order Placed Successfully' });
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err.message });
    }
  }

  static fetchOrders = async (req, res) => {
    try {
      const data = await OrderedProduct.findAll({
        include: [{ model: Order, as: 'orderData' }],
        order: [['id', 'DESC']],
      });

      res.status(201).json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err.message });
    }
  }

  static fetchOrdersByUserId = async (req, res) => {
    try {
      const data = await OrderedProduct.findAll({
        where: { userId: req.params.id },
        order: [['id', 'DESC']],
      });

      res.status(201).json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err.message });
    }
  }

  static fetchOrder = async (req, res) => {
    try {
      const orderedProduct = await OrderedProduct.findByPk(req.params.id);
      const order = await Order.findByPk(orderedProduct.orderId);

      const data = { orderedProduct, order };

      res.status(201).json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err.message });
    }
  }

  static updateOrder = async (req, res) => {
    try {
      const { status } = req.body;

      const today = new Date();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      const year = today.getFullYear();

      const currentDate = `${month}/${day}/${year}`;

      let data;

      switch (status) {
        case 'Shipped':
          data = await OrderedProduct.update(
            {
              status,
              isShipped: 1,
              shipmentDate: currentDate,
              isOutForDelivery: 0,
              isDelivered: 0,
            },
            { where: { id: req.params.id } }
          );
          break;
        case 'Out for delivery':
          data = await OrderedProduct.update(
            {
              status,
              isShipped: 1,
              isOutForDelivery: 1,
              outForDeliveryDate: currentDate,
              isDelivered: 0,
            },
            { where: { id: req.params.id } }
          );
          break;
        case 'Delivered':
          data = await OrderedProduct.update(
            {
              status,
              isShipped: 1,
              isOutForDelivery: 1,
              isDelivered: 1,
              deliveryDate: currentDate,
            },
            { where: { id: req.params.id } }
          );
          break;
        case 'Cancelled':
          data = await OrderedProduct.update(
            {
              status,
              isCancelled: 1,
              cancellationDate: currentDate,
            },
            { where: { id: req.params.id } }
          );
          break;
        default:
          break;
      }

      if (data) {
        res.status(201).json({ status: 'success', message: 'Order Status Updated Successfully' });
      } else {
        res.status(401).json({ status: 'failed', message: 'Internal Server Error' });
      }
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err.message });
    }
  }
}

module.exports = OrderController;