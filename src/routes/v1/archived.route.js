const BoardsController = require("../../controllers/boards.controller");
const TicketsController = require("../../controllers/tickets.controller");
const StatesController = require("../../controllers/states.controller");
const DepartmentsController = require("../../controllers/departments.controller");

const {
  verifyLogin,
  //   checkUserInBoardMiddleWare,
} = require("../../middlewares/auth.middleware");

const router = require("express").Router();

router.get(
  "/boards",
  verifyLogin(["ADMIN"]),
  BoardsController.getArchivedBoards
);
router.get(
  "/tickets",
  verifyLogin(["ADMIN"]),
  TicketsController.getArchivedTickets
);
router.get(
  "/states",
  verifyLogin(["ADMIN"]),
  StatesController.getArchivedStates
);
router.get(
  "/departments",
  verifyLogin(["ADMIN"]),
  DepartmentsController.getArchivedDepartments
);
module.exports = router;
