const mongoose = require("mongoose");

// khởi tạo danh mục
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "can't be blank"],
      unique: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
