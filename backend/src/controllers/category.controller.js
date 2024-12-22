const Category = require('../models/category.model');
const { AppError } = require('../middleware/error.middleware');

const categoryController = {
  // Create category (Admin only)
  async createCategory(req, res, next) {
    try {
      const category = new Category(req.body);
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  },

  // Get all categories
  async getCategories(req, res, next) {
    try {
      const categories = await Category.find({ isActive: true })
        .populate('parent', 'name slug');
      res.json(categories);
    } catch (error) {
      next(error);
    }
  },

  // Get single category
  async getCategory(req, res, next) {
    try {
      const category = await Category.findById(req.params.id)
        .populate('parent', 'name slug');

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  // Update category (Admin only)
  async updateCategory(req, res, next) {
    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  // Delete category (Admin only)
  async deleteCategory(req, res, next) {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = categoryController;