const Order = require("../models/order.model");
const Product = require("../models/product.model");

function ProductController() {
  // tạo mới sản phẩm 
  this.create = async (req, res) => {
    try {
      const { name, description, price, quantity, cost, categoryId, image } =
        req.body;
      const product = new Product({
        name,
        description,
        price,
        cost,
        quantity,
        categoryId,
        image,
      });
      await product.save();
      res.status(201).json({ message: "Created successfully", data: product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // lấy tất cả sản phẩm 
  this.getAll = async (req, res) => {
    try {
      let name = req.query.name;
      let query = {};
      if (name && name !== "") {
        query.name = { $regex: name, $options: "i" };
      }
      const products = await Product.find(query);
      res.status(200).json({ data: products });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // lấy theo id
  this.getById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found!" });
      }
      res.status(200).json({ data: product });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // update sản phẩm, ko tồn tại trả về 
  this.update = async (req, res) => {
    try {
      const { name, description, price, quantity, cost, categoryId, image } =
        req.body;
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { name, description, price, quantity, cost, categoryId, image },
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found!" });
      }
      res.status(200).json({
        message: "Updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // xóa sản phẩm
  this.delete = async (req, res) => {
    //kiểm tra nếu sp có trong đơn hàng ko xóa dc
    try {
      const productInOrders = await Order.find({
        "products.product": req.params.id,
      });
      if (productInOrders.length > 0) {
        return res.status(400).json({
          message:
            "This product is associated with one or more orders and cannot be deleted.",
        });
      }

      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found!" });
      }
      res.status(200).json({
        message: "Deleted successfully",
        data: deletedProduct,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  //tính số lượng sp còn lại
  this.getRemainingQuantity = async (req, res) => {
    try {
      const productId = req.params.id;

      const orders = await Order.find({ product: productId });
      const totalOrderedQuantity = orders.reduce(
        (total, order) => total + order.quantity,
        0
      );

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found!" });
      }

      const remainingQuantity = product.quantity - totalOrderedQuantity;

      res.status(200).json({ remainingQuantity });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  //ds sp còn hàng
  this.getInventoryProducts = async (req, res) => {
    try {
      const allProducts = await Product.find();
      const inventoryProducts = allProducts.filter(
        (product) => product.quantity > 0
      );
      res.status(200).json({ data: inventoryProducts });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  return this;
}

module.exports = new ProductController();
