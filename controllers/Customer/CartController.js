const { Op } = require('sequelize');
const Cart = require('../../models/Cart');

class CartController {
  static storeProductInCart = async (req, res) => {
    try {
      const { userId, productId, productName, productPrice, quantity, productImage } = req.body;

      const isProductExist = await Cart.findOne({ where: { userId, productId } });

      if (!isProductExist) {
        const data = await Cart.create({
          userId,
          productId,
          productName,
          productPrice,
          quantity,
          productImage,
        });
      } else {
        const data = await Cart.update(
          {
            productName,
            quantity: isProductExist.quantity + quantity,
            productImage,
            productPrice,
          },
          { where: { id: isProductExist.id } }
        );
      }

      if (data) {
        res.status(201).json({ status: 'success', message: 'Product Added in Cart' });
      } else {
        res.status(401).json({ status: 'failed', message: 'Internal Server Error' });
      }
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err.message });
    }
  }

  static fetchCartProducts = async (req, res) => {
    try {
      const data = await Cart.findAll({ where: { userId: req.params.id } });
      res.status(201).json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err.message });
    }
  }

  static updateProductInCart = async (req, res) => {
    try {
      const { userId, productId, productName, productPrice, quantity, productImage } = req.body;

      const isProductExist = await Cart.findOne({ where: { userId, productId } });

      if (isProductExist) {
        const data = await Cart.update(
          {
            productName,
            quantity,
            productImage,
            productPrice,
          },
          { where: { id: isProductExist.id } }
        );

        if (data) {
          res.status(201).json({ status: 'success', message: 'Product Updated in Cart' });
        } else {
          res.status(401).json({ status: 'failed', message: 'Internal Server Error' });
        }
      } else {
        res.status(401).json({ status: 'failed', message: 'Internal Server Error' });
      }
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err.message });
    }
  }

  static deleteProductFromCart = async (req, res) => {
    try {
      const { userId, productId } = req.body;

      const isProductExist = await Cart.findOne({ where: { userId, productId } });

      if (isProductExist) {
        const data = await Cart.destroy({ where: { id: isProductExist.id } });

        if (data) {
          res.status(201).json({ status: 'success', message: 'Product Deleted from Cart' });
        } else {
          res.status(401).json({ status: 'failed', message: 'Internal Server Error' });
        }
      } else {
        res.status(401).json({ status: 'failed', message: 'Internal Server Error' });
      }
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err.message });
    }
  }

  static clearCart = async (req, res) => {
    try {
      const { userId } = req.body;

      const carts = await Cart.findAll({ where: { userId } });

      if (carts.length !== 0) {
        const clearCart = await Cart.destroy({ where: { userId } });
      }
      res.status(201).json({ status: 'success', message: 'Cart cleared successfully' });
    } catch (err) {
      res.status(500).json({ status: 'failed', message: err.message });
    }
  };
}

module.exports = CartController;