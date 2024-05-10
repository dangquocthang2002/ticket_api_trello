const notificationController = require("../../controllers/notification.controller");
const { verifyLogin } = require("../../middlewares/auth.middleware");

const router = require("express").Router();

router.post("/", notificationController.createNotification);

router.get(
  "/list",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  notificationController.getListNotificationByToId,
);

router.get(
  "/numberUnseen",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  notificationController.getNumberUnseen,
);

module.exports = router;
