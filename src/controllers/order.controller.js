const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

function OrderController() {
  // lấy tất cả đơn hàng if
  this.getAll = async (req, res) => {
    try {
      let status = req.query.status;
      let query = {};
      if (status && status !== "") {
        query.status = { $regex: status, $options: "i" };
      }

      const orders = await Order.find(query).populate("products.product");
      res.status(200).json({ data: orders });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // get theo id
  this.getById = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found!" });
      }
      res.status(200).json({ data: order.status });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // tạo đơn hàng
  this.create = async (req, res) => {
    try {
      const { products, shippingAddress, phone } = req.body;
      const userId = req.user._id;

      let total = 0;
      const orderProducts = [];

      // update số lượng
      for (const item of products) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({ message: "Product not found!" });
        }

        // tính tổng
        total += product.price * item.quantity;
        orderProducts.push({
          product: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // tạo đơn đặt hàng
      const order = new Order({
        user: userId,
        products: orderProducts,
        total,
        shippingAddress,
        phone,
        status: "PENDING",
      });

      await order.save();

      // cập nhập số lượng sản phẩm trên db và giỏ hàng
      for (const item of products) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.quantity -= item.quantity;
          await product.save();
        }
      }

      // có giỏ hàng thì xóa các mặt hàng đã đặt
      const cart = await Cart.findOne({ user: userId });
      if (cart) {
        for (const item of orderProducts) {
          cart.items = cart.items.filter(
            (cartItem) => !cartItem.product.equals(item.product)
          );
        }
        cart.total = cart.items.reduce(
          (acc, curr) => acc + curr.quantity * curr.price,
          0
        );
        await cart.save();
      }

      res.status(201).json({ message: "Order created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error!" });
    }
  };

  // gửi phản hồi trạng thái đơn hàng
  this.getAllOrdersForCurrentUser = async (req, res) => {
    try {
      const userId = req.user._id;
      let query = { user: userId };
      const status = req.query.status;
      if (
        status &&
        ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"].includes(
          status
        )
      ) {
        query.status = status;
      }
      const orders = await Order.find(query).populate("products.product");
      res.status(200).json({ orders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error!" });
    }
  };

  // cập nhập trạng thái đơn hàng theo id
  this.updateOrderStatus = async (req, res) => {
    try {
      const orderId = req.params.id;
      const { status } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found!" });
      }

      order.status = status;
      await order.save();

      res.status(200).json({ message: "Order status updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error!" });
    }
  };

  // xóa đươn hàng chỉ add 
  this.delete = async (req, res) => {
    try {
      const orderId = req.params.id;
      const userId = req.user._id;
      const isAdmin = req.user.isAdmin;
      // tìm 
      const order = await Order.findByIdAndDelete(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found!" });
      }

      // check xem có phải người dùng và admin mới dc xóa
      if (order.user.toString() !== userId.toString() && !isAdmin) {
        return res
          .status(403)
          .json({ message: "Unauthorized to delete this order!" });
      }
      await order;
      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error!" });
    }
  };

  return this;
}

module.exports = new OrderController();
