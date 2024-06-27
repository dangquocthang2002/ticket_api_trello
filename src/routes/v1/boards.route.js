const BoardsController = require("../../controllers/boards.controller");
const StatesController = require("../../controllers/states.controller");
const LabelsController = require("../../controllers/labels.controller");
const BoardsInvitedMembersController = require("../../controllers/boardsInvitedMembers.controller");
const SlackConnectionController = require("../../controllers/slackConnection.controller");
const GithubConnectionController = require("../../controllers/githubConnection.controller");

const {
  verifyLogin,
  checkUserInBoardMiddleWare,
} = require("../../middlewares/auth.middleware");
const JoiSchemaValidation = require("../../middlewares/validation.middleware");
const {
  AddBoardSchema,
  UpdateBoardSchema,
} = require("../../validation/boards.validation");
const epicController = require("../../controllers/epics.controller");
const boardViewOnly = require("../../middlewares/boardViewOnly.middleware");
const {
  getBoardByBoardId,
} = require("../../services/boardsService/getBoardOfEntity.service");

const router = require("express").Router();
const viewModeOnlyByBoard = boardViewOnly((req) =>
  getBoardByBoardId(req.boardId)
);
//add board
router.post(
  "/",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  JoiSchemaValidation(AddBoardSchema),
  BoardsController.addBoard
);

//Show boards
router.get(
  "/",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  BoardsController.showBoards
);

//Update board

const boardUserRouter = require("express").Router();
//Get board By ID
router.use(
  "/:id",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  checkUserInBoardMiddleWare(),
  boardUserRouter
);
boardUserRouter.get("/", BoardsController.getBoardById);

//Get board By ID
boardUserRouter.get("/states", StatesController.showStatesByBoard);

// Get Label By boardId
boardUserRouter.get("/labels", LabelsController.getLabelsByBoard);
//invitedMembers-board

boardUserRouter.get(
  "/invited-members",

  BoardsInvitedMembersController.getInvitedMembersOfBoard
);

boardUserRouter.post(
  "/invited-members",
  viewModeOnlyByBoard,
  BoardsInvitedMembersController.addInvitedMembersToBoard
);

boardUserRouter.delete(
  "/invited-members",
  viewModeOnlyByBoard,
  BoardsInvitedMembersController.deleteInvitedMembersFromBoard
);
boardUserRouter.put(
  "/",
  verifyLogin(["ADMIN"]),
  JoiSchemaValidation(UpdateBoardSchema),
  BoardsController.updateBoard
);

//Delete board
boardUserRouter.delete(
  "/",
  verifyLogin(["ADMIN"]),
  BoardsController.deleteBoard
);

boardUserRouter.get("/epics", epicController.getEpicsByBoardId);

boardUserRouter.get(
  "/slack",
  verifyLogin(["ADMIN"]),
  viewModeOnlyByBoard,
  SlackConnectionController.showSlackDataByBoard
);

boardUserRouter.put(
  "/slack",
  verifyLogin(["ADMIN"]),
  viewModeOnlyByBoard,
  SlackConnectionController.updateSlackData
);
boardUserRouter.get(
  "/tickets",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  BoardsController.getTicketsInBoard
);

boardUserRouter.get(
  "/tickets-done",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  BoardsController.getTicketsDoneInBoard
);

boardUserRouter.get(
  "/github",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByBoard,
  GithubConnectionController.showGithubDataByBoard
);
boardUserRouter.post(
  "/github",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByBoard,
  GithubConnectionController.createGithubDataByBoard
);
boardUserRouter.put(
  "/github",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByBoard,
  GithubConnectionController.updateGithubData
);

module.exports = router;
