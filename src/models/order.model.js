const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "can't be blank"],
    },
    products: [
      {
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
      },
    ],
    total: {
      type: Number,
      required: [true, "can't be blank"],
      min: [0, "must be at least 0"],
    },
    phone: {
      type: Number,
      required: [true, "can't be blank"],
    },
    shippingAddress: {
      type: String,
      required: [true, "can't be blank"],
    },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
