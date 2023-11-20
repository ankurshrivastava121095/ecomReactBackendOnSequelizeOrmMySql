const { Op } = require('sequelize');
const Category = require('../../models/Category');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'depjzfj9a',
  api_key: '489915939841262',
  api_secret: '5tBdTUHJ33XMIN3iP-49Rfeps9I',
});

class CategoryController {
  static storeCategory = async (req, res) => {
    try {
      const { categoryName, categoryDescription } = req.body;
      const file = req.files.categoryImage;

      if (file.size >= 1500000) {
        res.status(401).json({ status: 'failed', message: 'File Size is too long, Select less than 15MB' });
      } else {
        const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'oriolEcomImages',
        });

        const data = await Category.create({
          categoryName,
          categoryDescription,
          categoryImage: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
        });

        if (data) {
          res.status(201).json({ status: 'success', message: 'Category Saved Successfully' });
        } else {
          res.status(401).json({ status: 'failed', message: 'Internal Server Error' });
        }
      }
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err });
    }
  }

  static fetchCategories = async (req, res) => {
    try {
      const data = await Category.findAll({
        where: { isDeleted: 0 },
        order: [['id', 'DESC']],
      });

      res.status(201).json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err });
    }
  }

  static fetchCategory = async (req, res) => {
    try {
      const data = await Category.findByPk(req.params.id);

      res.status(201).json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err });
    }
  }

  static updateCategory = async (req, res) => {
    try {
      const { categoryName, categoryDescription } = req.body;

      if (req.files != null) {
        const categoryImg = await Category.findByPk(req.params.id);

        if (categoryImg.categoryImage.public_id) {
          const imageId = categoryImg.categoryImage.public_id;
          await cloudinary.uploader.destroy(imageId);
        }

        const file = req.files.categoryImage;
        const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'oriolEcomImages',
        });

        await Category.update(
          {
            categoryName,
            categoryDescription,
            categoryImage: {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            },
          },
          {
            where: { id: req.params.id },
          }
        );
      } else {
        await Category.update(
          {
            categoryName,
            categoryDescription,
          },
          {
            where: { id: req.params.id },
          }
        );
      }

      res.status(201).json({ status: 'success', message: 'Category Updated Successfully' });
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err });
    }
  }

  static deleteCategory = async (req, res) => {
    try {
      await Category.update(
        {
          isDeleted: 1,
        },
        {
          where: { id: req.params.id },
        }
      );

      res.status(201).json({ status: 'success', message: 'Category Deleted Successfully' });
    } catch (err) {
      res.status(401).json({ status: 'failed', message: err });
    }
  }
}

module.exports = CategoryController;