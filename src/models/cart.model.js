const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "must be at least 1"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "must be at least 0"],
  },
});

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "can't be blank"],
    },
    items: [CartItemSchema],
    total: {
      type: Number,
      required: [true, "can't be blank"],
      min: [0, "must be at least 0"],
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
