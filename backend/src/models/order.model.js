const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // Add index for faster queries
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity cannot be less than 1"],
      },
      price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"],
      },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
    index: true, // Add index for status-based queries
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  payment: {
    method: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
      index: true, // Add index for payment status queries
    },
    transactionId: { type: String },
    amount: {
      type: Number,
      required: true,
      min: [0, "Payment amount cannot be negative"],
    },
  },
  trackingNumber: { type: String },
  subtotal: {
    type: Number,
    required: true,
    min: [0, "Subtotal cannot be negative"],
  },
  tax: {
    type: Number,
    required: true,
    min: [0, "Tax cannot be negative"],
  },
  shippingCost: {
    type: Number,
    required: true,
    min: [0, "Shipping cost cannot be negative"],
  },
  total: {
    type: Number,
    required: true,
    min: [0, "Total cannot be negative"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // Add index for date-based queries
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add compound index for user and date queries
orderSchema.index({ user: 1, createdAt: -1 });

// Pre-save middleware to update timestamps
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for order age
orderSchema.virtual("orderAge").get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // Age in days
});

// Method to calculate order total
orderSchema.methods.calculateTotal = function () {
  this.subtotal = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  this.tax = this.subtotal * 0.1; // 10% tax
  this.total = this.subtotal + this.tax + this.shippingCost;
  return this.total;
};

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function () {
  const nonCancellableStatuses = ["shipped", "delivered", "cancelled"];
  return !nonCancellableStatuses.includes(this.status);
};

// Static method to get user's order statistics
orderSchema.statics.getUserOrderStats = async function (userId) {
  return this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: "$total" },
        averageOrderValue: { $avg: "$total" },
      },
    },
  ]);
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
