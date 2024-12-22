const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const { AppError } = require("../middleware/error.middleware");

const validateInventory = async (
  productId,
  requestedQuantity,
  existingQuantity = 0
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const totalRequestedQuantity = requestedQuantity + existingQuantity;
  if (product.inventory.quantity < totalRequestedQuantity) {
    throw new AppError("Insufficient stock", 400);
  }

  return product;
};

const cartController = {
  // Get user's cart
  async getCart(req, res, next) {
    try {
      const cart = await Cart.findOne({ user: req.user._id }).populate(
        "items.product",
        "name price images inventory"
      );

      if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
      }

      res.json(cart);
    } catch (error) {
      next(error);
    }
  },

  // Add item to cart
  async addToCart(req, res, next) {
    try {
      const { productId, quantity } = req.body;

      let cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
      }

      const existingItem = cart?.items.find(
        (item) => item.product.toString() === productId
      );

      // Validate inventory before adding/updating
      await validateInventory(productId, quantity, existingItem?.quantity || 0);

      // Use schema methods
      if (cart.hasProduct(productId)) {
        const existingItem = cart.getItem(productId);
        const newQuantity = existingItem.quantity + quantity;
        cart.updateItemQuantity(productId, newQuantity);
      } else {
        cart.items.push({ product: productId, quantity });
      }

      cart.updatedAt = Date.now();
      await cart.save();

      res.json(cart);
    } catch (error) {
      next(error);
    }
  },

  // Update cart item quantity
  async updateCartItem(req, res, next) {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;

      if (quantity < 1) {
        throw new AppError("Invalid quantity", 400);
      }

      // Validate product and check stock
      const product = await Product.findById(productId);
      if (!product) {
        throw new AppError("Product not found", 404);
      }

      if (product.inventory.quantity < quantity) {
        throw new AppError("Insufficient stock", 400);
      }

      // Update cart using schema methods
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        throw new AppError("Cart not found", 404);
      }

      if (!cart.hasProduct(productId)) {
        throw new AppError("Item not found in cart", 404);
      }

      cart.updateItemQuantity(productId, quantity);
      cart.updatedAt = Date.now();
      await cart.save();

      await cart.populate("items.product", "name price images inventory");
      res.json(cart);
    } catch (error) {
      next(error);
    }
  },

  // Remove item from cart
  async removeFromCart(req, res, next) {
    try {
      const { productId } = req.params;

      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        throw new AppError("Cart not found", 404);
      }

      cart.removeItem(productId);

      cart.updatedAt = Date.now();
      await cart.save();
    } catch (error) {
      next(error);
    }
  },

  // Clear cart
  async clearCart(req, res, next) {
    try {
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        throw new AppError("Cart not found", 404);
      }

      cart.items = [];
      cart.updatedAt = Date.now();
      await cart.save();

      res.json(cart);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = cartController;
