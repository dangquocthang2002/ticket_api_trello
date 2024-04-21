const User = require("../models/users.model");
const { deleteBoardByUserId } = require("../services/boards.service");
const {
  deleteTicketByUserId,
  deleteTicketFilesByUserId,
} = require("../services/tickets.service");

const userController = {
  showUsers: async (req, res) => {
    try {
      const users = await User.find()
        .populate("avatar")
        .select("-password")
        .exec();
      res.status(200).json(users);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  createUser: async (req, res) => {
    try {
      const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
      });
      res.status(200).json(newUser);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await deleteBoardByUserId(req.params.id);
      await deleteTicketByUserId(req.params.id);
      await deleteTicketFilesByUserId(req.params.id);
      await User.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Delete user successful!" });
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
