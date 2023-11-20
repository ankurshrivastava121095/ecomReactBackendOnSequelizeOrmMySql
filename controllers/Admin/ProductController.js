const { Op } = require('sequelize');
const Category = require('../../models/Category');
const Product = require('../../models/Product');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'depjzfj9a',
  api_key: '489915939841262',
  api_secret: '5tBdTUHJ33XMIN3iP-49Rfeps9I',
});

class ProductController {
  static storeProduct = async (req, res) => {
    try {
      const { productName, productDescription, productCategory, productPrice, productQuantity } = req.body;
      const file = req.files.productImage;
      const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'oriolEcomImages',
      });

      const data = await Product.create({
        productName,
        productDescription,
        productCategory,
        productPrice,
        productQuantity,
        productImage: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      });

      if (data) {
        res.status(201).json({ status: 'success', message: 'Project Saved Successfully' });
      } else {
        res.status(401).json({ status: 'failed', message: 'Internal Server Error' });
      }
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err });
    }
  }

  static fetchProducts = async (req, res) => {
    try {
      const data = await Product.findAll({
        where: { isDeleted: 0 },
        order: [['id', 'DESC']],
        include: {
          model: Category,
          as: 'category',
          attributes: { exclude: ['createdAt', 'updatedAt', 'isDeleted'] },
        },
      });

    // console.log(data);

      res.status(201).json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err });
    }
  }

  static fetchProductsCategoryWise = async (req, res) => {
    try {
      const products = await Product.findAll({
        where: { productCategory: req.params.id, isDeleted: 0 },
      });

      const category = await Category.findByPk(req.params.id, {
        attributes: { exclude: ['createdAt', 'updatedAt', 'isDeleted'] },
      });

      const data = { products, category };
      res.status(201).json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err });
    }
  }

  static fetchProduct = async (req, res) => {
    try {
      const data = await Product.findByPk(req.params.id);

      res.status(201).json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err });
    }
  }

  static updateProduct = async (req, res) => {
    try {
      const { productName, productDescription, productCategory, productPrice, productQuantity } = req.body;

      if (req.files != null) {
        const productImg = await Product.findByPk(req.params.id);

        if (productImg.productImage.public_id) {
          const imageId = productImg.productImage.public_id;
          await cloudinary.uploader.destroy(imageId);
        }

        const file = req.files.productImage;
        const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'oriolEcomImages',
        });

        await Product.update(
          {
            productName,
            productDescription,
            productCategory,
            productPrice,
            productQuantity,
            productImage: {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            },
          },
          {
            where: { id: req.params.id },
          }
        );
      } else {
        await Product.update(
          {
            productName,
            productDescription,
            productCategory,
            productPrice,
            productQuantity,
          },
          {
            where: { id: req.params.id },
          }
        );
      }

      res.status(201).json({ status: 'success', message: 'Project Updated Successfully' });
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err });
    }
  }

  static deleteProduct = async (req, res) => {
    try {
      await Product.update(
        {
          isDeleted: 1,
        },
        {
          where: { id: req.params.id },
        }
      );

      res.status(201).json({ status: 'success', message: 'Project Deleted Successfully' });
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err });
    }
  }
}

module.exports = ProductController;