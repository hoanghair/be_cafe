const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

function CartController() {
  this.create = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user._id;

      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found!");
      }

      if (
        product.quantity <= 0 ||
        quantity <= 0 ||
        quantity > product.quantity
      ) {
        return res
          .status(400)
          .json({ error: "Product is not available in sufficient quantity." });
      }

      let cart = await Cart.findOne({ user: userId });

      if (!cart) {
        cart = new Cart({
          user: userId,
          items: [],
          total: 0,
        });
      }

      const productIndex = cart.items.findIndex((item) =>
        item.product.equals(productId)
      );

      if (productIndex !== -1) {
        cart.items[productIndex].quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
          price: product.price,
        });
      }

      cart.total = cart.items.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );

      await cart.save();

      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  this.update = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user._id;

      const cart = await Cart.findOne({ user: userId });

      if (!cart) {
        return res.status(404).json({ error: "Cart not found!" });
      }

      const productIndex = cart.items.findIndex((item) =>
        item.product.equals(productId)
      );

      if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found in cart!" });
      }

      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found!");
      }

      if (quantity > product.quantity) {
        return res.status(400).json({ error: "Not enough quantity in stock." });
      }

      cart.items[productIndex].quantity = quantity;
      cart.items[productIndex].price = product.price;

      cart.total = cart.items.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );

      await cart.save();

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  this.delete = async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user._id;

      const cart = await Cart.findOne({ user: userId });

      if (!cart) {
        return res.status(404).json({ error: "Cart not found!" });
      }

      cart.items = cart.items.filter((item) => !item.product.equals(productId));

      cart.total = cart.items.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );

      await cart.save();

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  this.mySelf = async (req, res) => {
    try {
      const userId = req.user._id;

      const cart = await Cart.findOne({ user: userId }).populate(
        "items.product"
      );

      if (!cart) {
        return res.status(404).json({ error: "Cart not found!" });
      }

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  return this;
}

module.exports = CartController();
