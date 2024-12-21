const mongoose = require("mongoose");
const { updateOne } = require("./category.model");
const { updateMany } = require("./category.model");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  salePrice: {
    type: Number,
    min: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  images: [
    {
      url: { type: String, required: true },
      alt: { type: String },
      isDefault: { type: Boolean, default: false },
    },
  ],
  inventory: {
    quantity: { type: Number, required: true, min: 0 },
    reservedQuantity: { type: Number, default: 0, min: 0 },
    sku: { type: String, required: true, unique: true },
  },
  attributes: [
    {
      name: { type: String },
      value: { type: String },
    },
  ],
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for better query performance
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, isActive: 1 }); // Category and status queries
productSchema.index({ "inventory.sku": 1 }); // SKU lookups
productSchema.index({ price: 1 }); // Price-based queries and sorting
productSchema.index({ createdAt: -1 }); // Date-based queries and sorting
productSchema.index({ "ratings.average": -1 }); // Rating-based queries and sorting

// Pre save middleware
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virutal for checking if product is in stock
productSchema.virtual("inStock").get(function () {
  return this.inventory.quantity - this.inventory.reservedQuantity;
});

// Method to update ratings
productSchema.methods.updateRatings = async function (rating) {
  this.ratings.count += 1;
  this.ratings.average =
    (this.ratings.average * (this.ratings.count - 1) + rating) /
    this.ratings.count;
  await this.save();
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
