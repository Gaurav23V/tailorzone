const Product = require("../models/product.model");
const { AppError } = require("../middleware/error.middleware");

const productController = {
  // Create product (Admin only)
  async createProduct(req, res, next) {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },

  // Get all the products with filtering sorting and pagination
  async getProducts(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = "-createdAt",
        category,
        minPrice,
        maxPrice,
        search,
      } = req.query;

      // Build query
      const query = {};

      // Filter by category
      if (category) {
        query.category = category;
      }

      // Price filter
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      // Search filter
      if (search) {
        query.$text = { $search: search };
      }

      // Active products only
      query.isActive = true;

      // Execute query with pagination
      const products = await Product.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("category", "name slug");

      // get total count
      const total = await Product.countDocuments(query);

      res.json({
        products,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      next(error);
    }
  },

  // Get single product
  async getProduct(req, res, next) {
    try {
      const product = await Product.findById(req.params.id).populate(
        "category",
        "name slug"
      );

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  // Update product (Admin only)
  async updateProduct(req, res, next) {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  // Detete product (Admin only)
  async deleteProduct(req, res, next) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
