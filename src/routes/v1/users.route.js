const UsersController = require("../../controllers/users.controller");
const BoardsInvitedMembersController = require("../../controllers/boardsInvitedMembers.controller");
const DepartmentsUsersController = require("../../controllers/departmentsUsers.controller");

const { verifyLogin } = require("../../middlewares/auth.middleware");
const { CreateUserSchema } = require("../../validation/users.validation");
const JoiSchemaValidation = require("../../middlewares/validation.middleware");

const router = require("express").Router();

router.get(
  "/",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  UsersController.showUsers,
);

router.get(
  "/email-user",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  UsersController.findUserByEmail,
);

router.get(
  "/:id/invited-boards",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  BoardsInvitedMembersController.getListBoardsOfInvitedMember,
);

router.post(
  "/create-user",
  verifyLogin(["ADMIN", "LEADER"]),
  JoiSchemaValidation(CreateUserSchema),
  UsersController.createUser,
);

router.delete(
  "/:id",
  // verifyLogin(["ADMIN", "LEADER"]),
  UsersController.deleteUser,
);

router.get(
  "/:id/departments",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  DepartmentsUsersController.getListDepartmentsOfUser,
);

module.exports = router;
