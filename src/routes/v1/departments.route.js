const DepartmentsController = require("../../controllers/departments.controller");
const DepartmentsUsersController = require("../../controllers/departmentsUsers.controller");
const BoardsController = require("../../controllers/boards.controller");
const { verifyLogin } = require("../../middlewares/auth.middleware");

const router = require("express").Router();

//Add Department
router.post("/", verifyLogin(["ADMIN"]), DepartmentsController.addDepartment);

//Show Departments
router.get(
  "/",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  DepartmentsController.showDepartments
);

//Get Department By ID
router.get(
  "/:id",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  DepartmentsController.getDepartmentById
);

//Update Department
router.put(
  "/:id",
  verifyLogin(["ADMIN"]),
  DepartmentsController.updateDepartment
);

//Delete Department
router.delete(
  "/:id",
  verifyLogin(["ADMIN"]),
  DepartmentsController.deleteDepartment
);

router.get(
  "/:id/users",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  DepartmentsUsersController.getListUsersOfDepartment
);
router.post(
  "/:id/users",
  verifyLogin(["ADMIN"]),
  DepartmentsUsersController.addUsersToDepartment
);
router.delete(
  "/:id/users",
  verifyLogin(["ADMIN"]),
  DepartmentsUsersController.deleteUsersFromDepartment
);

//boards
router.get(
  "/:id/boards",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  BoardsController.getBoardByDepartmentId
);
module.exports = router;
