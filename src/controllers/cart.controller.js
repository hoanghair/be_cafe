const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

function CartController() {
  // tạo giỏ hàng
  this.create = async (req, res) => {
    try {
      // lấy id và số lượng từ user
      const { productId, quantity } = req.body;
      const userId = req.user._id;

      // check xem tồn tại và đủ số lượng không
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

      // tạo giỏ hàng cho user
      let cart = await Cart.findOne({ user: userId });

      // thêm hoặc cập nhập cart
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

      // tính lại tổng
      cart.total = cart.items.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );

      // lưu cart
      await cart.save();

      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // update cart
  this.update = async (req, res) => {
    try {
      // cập nhập số lượng
      const { productId, quantity } = req.body;
      const userId = req.user._id;

      const cart = await Cart.findOne({ user: userId });

      // kiểm tra xem có tồn tại cart
      if (!cart) {
        return res.status(404).json({ error: "Cart not found!" });
      }

      // kiểm tra sản phẩm 
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

      // update và tính toán
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

  // xóa sản phẩm khỏi giỏ hàng
  this.delete = async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user._id;

      const cart = await Cart.findOne({ user: userId });

      // kiểm tra xem có tồn tại giỏ hàng
      if (!cart) {
        return res.status(404).json({ error: "Cart not found!" });
      }

      // lọc sản phẩm khỏi các mặt hàng
      cart.items = cart.items.filter((item) => !item.product.equals(productId));

      // tính tổng lại
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

  // truy suất giỏ hàng của người dùng đã dc thêm vào
  this.mySelf = async (req, res) => {
    try {
      const userId = req.user._id;

      const cart = await Cart.findOne({ user: userId }).populate(
        "items.product"
      );

      // kiểm tra giỏ hàng xem có tồn tại
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
