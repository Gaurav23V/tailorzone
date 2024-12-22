const mongoose = require("mongoose");

const { Schema } = mongoose;

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity cannot be less than 1"],
      },
      addedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

cartSchema.index({ "items.product": 1 });

// Virtual for total items count
cartSchema.virtual("totalItems").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Pre save middleware to update timestamps
cartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if product exists in cart
cartSchema.methods.hasProduct = function (productId) {
  return this.items.some(
    (item) => item.product.toString() === productId.toString()
  );
};

// Method to get cart item
cartSchema.methods.getItem = function (productId) {
  return this.items.find(
    (item) => item.product.toString() === productId.toString()
  );
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function (productId, quantity) {
  const item = this.getItem(productId);
  if (item) {
    item.quantity = quantity;
  }
  return this;
};

// Method to remove item
cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );
  return this;
};

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
