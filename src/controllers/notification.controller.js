const {
  createNotification,
  checkAndCreateNotification,
} = require("../services/notification.service");
const Notification = require("../models/notification.model");

const notificationController = {
  createNotification: async (req, res) => {
    try {
      await checkAndCreateNotification();
      res.status(200).json("Success");
    } catch (error) {}
  },
  getListNotificationByToId: async (req, res) => {
    try {
      let perPage = req.query.perPage || 20;
      let page = req.query.page || 1;
      const value = await Notification.find({
        toId: req.data._id,
      })
        .sort({ createdAt: -1 })
        .skip(perPage * page - perPage)
        .limit(perPage);
      res.status(200).json(value);
      value.forEach((notification) => {
        if (!notification.isSeen) {
          notification.isSeen = true;
          notification.save();
        }
      });
    } catch (error) {}
  },
  getNumberUnseen: async (req, res) => {
    try {
      const value = await Notification.find({
        toId: req.data._id,
        isSeen: false,
      });
      res.status(200).json(value.length);
    } catch (error) {}
  },
};
module.exports = notificationController;
