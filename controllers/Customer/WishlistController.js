const { Op } = require('sequelize');
const Wishlist = require('../../models/Wishlist');

class WishlistController {
  static storeProductInWishlist = async (req, res) => {
    try {
      const { userId, productId, productDetail } = req.body;
      const productID= parseInt(productId, 10);

      const isProductExist = await Wishlist.findOne({
        where: { userId: userId, productId: productID },
      });

      if (isProductExist) {
        await Wishlist.destroy({ where: { id: isProductExist.id } });
      }

      const dataSaved = await Wishlist.create({
        userId: userId,
        productId: productID,
        productName: productDetail.productName,
        productPrice: productDetail.productPrice,
        productImage: productDetail.productImage,
      });

      if (dataSaved) {
        res
          .status(201)
          .json({ status: 'success', message: 'Product Added in Wishlist' });
      } else {
        res
          .status(401)
          .json({ status: 'failed', message: 'Internal Server Error' });
      }
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err.message });
    }
  }

  static fetchAllWishlistProducts = async (req, res) => {
    try {
      const data = await Wishlist.findAll({ order: [['id', 'DESC']] });
      res.status(201).json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err.message });
    }
  }

  static fetchWishlistProducts = async (req, res) => {
    try {
      const data = await Wishlist.findAll({
        where: { userId: req.params.id },
        order: [['id', 'DESC']],
      });

      res.status(201).json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(401).json({ status: 'failed', message: `Error: ${err}` });
    }
  }

  static deleteProductFromWishlist = async (req, res) => {
    try {
        const productId = parseInt(req.params.id, 10);
        const isProductExist = await Wishlist.findByPk(productId);

        if (isProductExist) {
            await Wishlist.destroy({ where: { id: productId } });
            res.status(201).json({ status: 'success', message: 'Product Deleted Successfully' });
        } else {
            res.status(401).json({ status: 'failed', message: 'Product does not Exist' });
        }
    } catch (err) {
        res.status(401).json({ status: 'failed', message: err.message });
    }
  }
}

module.exports = WishlistController;