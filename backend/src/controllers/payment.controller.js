const paymentService = require("../services/payment.service");
const Order = require("../models/order.model");
const { AppError } = require("../middleware/error.middleware");

const paymentController = {
  // Initialize payment
  async initializePayment(req, res, next) {
    try {
      const { orderId } = req.body;

      // Find order
      const order = await Order.findOne({
        _id: orderId,
        user: req.user._id,
        "payment.status": "pending",
      });

      if (!order) {
        throw new AppError("Order not found or payment already completed", 404);
      }

      // Create razorpay order
      const razorpayOrder = await paymentService.createOrder(order.total);

      // Update order with Razorpay order ID
      order.payment.transactionId = razorpayOrder.id;
      await order.save();

      res.json({
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error) {
      next(error);
    }
  },

  // Verify payment
  async verifyPayment(req, res, next) {
    try {
      const { orderId, razorpayOrderId, razropayPaymentId, razorpaySignature } =
        req.body;

      // Verify signature
      const isValid = paymentService.verifyPaymentSignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );

      if (!isValid) {
        throw new AppError("Invalid payment signature", 400);
      }

      // Update order status
      const order = await Order.findById(orderId);
      if (!order) {
        throw new AppError("Order not found", 404);
      }

      order.payment.status = "completed";
      order.payment.transactionId = razorpayPaymentId;
      await order.save();

      res.json({
        success: true,
        message: "Payment verified successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = paymentController;
