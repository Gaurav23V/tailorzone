const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const { AppError } = require('../middleware/error.middleware');

const orderController = {
  // Create new order
  async createOrder(req, res, next) {
    try {
      const { shippingAddress, paymentMethod } = req.body;

      // Get user's cart
      const cart = await Cart.findOne({ user: req.user._id })
        .populate('items.product');

      if (!cart || cart.items.length === 0) {
        throw new AppError('Cart is empty', 400);
      }

      // Calculate order totals
      let subtotal = 0;
      const orderItems = [];

      // Validate inventory and create order items
      for (const item of cart.items) {
        const product = item.product;

        // Check inventory
        if (product.inventory.quantity < item.quantity) {
          throw new AppError(`Insufficient stock for ${product.name}`, 400);
        }

        // Calculate item total
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price
        });

        // Update product inventory
        await Product.findByIdAndUpdate(product._id, {
          $inc: {
            'inventory.quantity': -item.quantity
          }
        });
      }

      // Calculate tax and shipping
      const tax = subtotal * 0.1; // 10% tax
      const shippingCost = subtotal > 1000 ? 0 : 100; // Free shipping over 1000
      const total = subtotal + tax + shippingCost;

      // Create order
      const order = new Order({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        payment: {
          method: paymentMethod,
          amount: total
        },
        subtotal,
        tax,
        shippingCost,
        total
      });

      await order.save();

      // Clear cart
      await Cart.findByIdAndUpdate(cart._id, { $set: { items: [] } });

      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  },

  // Get order history
  async getOrders(req, res, next) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const query = { user: req.user._id };

      if (status) {
        query.status = status;
      }

      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('items.product', 'name images');

      const total = await Order.countDocuments(query);

      res.json({
        orders,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      next(error);
    }
  },

  // Get single order
  async getOrder(req, res, next) {
    try {
      const order = await Order.findOne({
        _id: req.params.id,
        user: req.user._id
      }).populate('items.product', 'name images');

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      res.json(order);
    } catch (error) {
      next(error);
    }
  },

  // Update order status (Admin only)
  async updateOrderStatus(req, res, next) {
    try {
      const { status } = req.body;
      const { id } = req.params;

      const order = await Order.findById(id);
      if (!order) {
        throw new AppError('Order not found', 404);
      }

      // Validate status transition
      const validTransitions = {
        pending: ['processing', 'cancelled'],
        processing: ['shipped', 'cancelled'],
        shipped: ['delivered'],
        delivered: [],
        cancelled: []
      };

      if (!validTransitions[order.status].includes(status)) {
        throw new AppError('Invalid status transition', 400);
      }

      order.status = status;
      if (status === 'shipped' && req.body.trackingNumber) {
        order.trackingNumber = req.body.trackingNumber;
      }

      await order.save();

      // TODO: Send order status update email to customer

      res.json(order);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = orderController;