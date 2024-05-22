const User = require("../models/user.model");

const adminAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new Error("User not authenticated");
    }

    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user || user.role !== "ADMIN") {
      throw new Error("User is not an admin");
    }

    next();
  } catch (error) {
    res.status(403).json({
      error: "Not authorized to access this resource",
      message: error.message,
    });
  }
};

module.exports = adminAuth;
