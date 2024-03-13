const activitiesController = require("../../controllers/activities.controller");
const { verifyLogin } = require("../../middlewares/auth.middleware");

const router = require("express").Router();

router.get(
  "/boards/:id",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  activitiesController.showActivitiesByBoard
);

router.get(
  "/tickets/:id",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  activitiesController.showActivitiesByTicket
);
module.exports = router;
