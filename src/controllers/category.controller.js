const Category = require("../models/category.model");

function CategoryController() {
  this.create = async (req, res) => {
    try {
      const { name } = req.body;
      const category = new Category({ name });
      await category.save();
      res.status(201).json({ message: "Created successfully", data: category });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  this.getAll = async (req, res) => {
    try {
      let name = req.query.name;
      let query = {};
      if (name && name !== "") {
        query.name = { $regex: name, $options: "i" };
      }

      const categories = await Category.find(query);
      res.status(200).json({ data: categories });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  this.getById = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found!" });
      }
      res.status(200).json({ data: category });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  this.update = async (req, res) => {
    try {
      const { name } = req.body;
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        { name },
        { new: true }
      );
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found!" });
      }
      res
        .status(200)
        .json({ message: "Updated successfully", data: updatedCategory });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  this.delete = async (req, res) => {
    try {
      const categoryId = req.params.id;

      const productsCount = await Product.countDocuments({ categoryId });

      if (productsCount > 0) {
        return res.status(400).json({
          message:
            "Cannot delete category. There are still products associated with it.",
        });
      }

      const deletedCategory = await Category.findByIdAndDelete(categoryId);

      if (!deletedCategory) {
        return res.status(404).json({ message: "Category not found!" });
      }

      res
        .status(200)
        .json({ message: "Deleted successfully", data: deletedCategory });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  return this;
}

module.exports = CategoryController();
