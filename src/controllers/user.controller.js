const User = require("../models/user.model");

function UserController() {
  this.find = async (req, res) => {
    return res.send(req.user);
  };

  this.register = async (req, res) => {
    try {
      const existingUser = await User.findOne({ email: req.body.email });

      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });

      await newUser.save();

      return res.json({ user: newUser.toAuthJSON() });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  this.getAll = async (req, res) => {
    try {
      let name = req.query.name;
      let query = {};
      if (name && name !== "") {
        query.username = { $regex: name, $options: "i" };
      }
      const users = await User.find(query);
      const transformedData = users.map((user) => {
        return {
          _id: user._id,
          role: user.role,
          username: user.username,
          email: user.email,
          password: user.password,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      });
      res.status(200).json({ data: transformedData });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  return this;
}

module.exports = UserController();
