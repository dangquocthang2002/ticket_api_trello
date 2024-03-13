const User = require("../models/users.model");

const userController = {
  showUsers: async (req, res) => {
    try {
      const users = await User.find().populate("avatar").select("-password").exec();
      res.status(200).json(users);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  findUserByEmail: async (req, res) => {
    try {
      const user = await User.find({
        email: req.body.email,
      });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(400).json({ message: "user not found!" });
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
};
module.exports = userController;
