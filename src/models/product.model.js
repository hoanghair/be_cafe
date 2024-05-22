const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name can't be blank"],
    },
    description: {
      type: String,
      required: [true, "Description can't be blank"],
    },
    price: {
      type: Number,
      required: [true, "Price can't be blank"],
      min: [0, "Price must be at least 0"],
    },
    cost: {
      type: Number,
      required: [true, "Cost can't be blank"],
      min: [0, "Cost must be at least 0"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity can't be blank"],
      min: [0, "Quantity must be at least 0"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: String,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
