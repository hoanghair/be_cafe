const Order = require("../models/order.model");
const Product = require("../models/product.model");

function RevenueController() {
  // Tính tổng doanh thu
  this.calculateTotalProfit = async (req, res) => {
    try {
      const orders = await Order.find({ status: "DELIVERED" });
      let totalProfit = 0;

      for (const order of orders) {
        for (const item of order.products) {
          const product = await Product.findById(item.product);
          totalProfit += item.quantity * product.price;
        }
      }

      res.status(200).json({ totalProfit });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Tính tổng lợi nhuận
  this.calculateTotalIncome = async (req, res) => {
    try {
      const orders = await Order.find({ status: "DELIVERED" });
      let totalIncome = 0;

      for (const order of orders) {
        for (const item of order.products) {
          const product = await Product.findById(item.product);
          totalIncome +=
            item.quantity * product.price - item.quantity * product.cost;
        }
      }

      res.status(200).json({ totalIncome });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  return this;
}

module.exports = new RevenueController();
