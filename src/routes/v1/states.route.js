const StatesController = require("../../controllers/states.controller");
const TicketsController = require("../../controllers/tickets.controller");

const { verifyLogin } = require("../../middlewares/auth.middleware");
const boardViewOnly = require("../../middlewares/boardViewOnly.middleware");
const JoiSchemaValidation = require("../../middlewares/validation.middleware");
const {
  getBoardByStateId,
  getBoardByBoardId,
} = require("../../services/boardsService/getBoardOfEntity.service");
const {
  AddStateSchema,
  UpdateStateSchema,
} = require("../../validation/states.validation");

const router = require("express").Router();

const viewModeOnlyByBoard = boardViewOnly((req) =>
  getBoardByBoardId(req.body.board)
);

const viewModeOnlyByState = boardViewOnly((req) =>
  getBoardByStateId(req.params.id)
);
//Add state
router.post(
  "/",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByBoard,
  JoiSchemaValidation(AddStateSchema),
  StatesController.addState
);

//Show states
router.get(
  "/",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  StatesController.showStates
);

//Get state By ID
router.get(
  "/:id",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  StatesController.getStateById
);

//Get state By ID
router.get(
  "/:id/tickets",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  TicketsController.showTicketsByState
);

//Update state
router.put(
  "/:id",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByState,
  JoiSchemaValidation(UpdateStateSchema),
  StatesController.updateState
);

//Delete state
router.delete("/:id", verifyLogin(["ADMIN"]), StatesController.deleteState);

module.exports = router;
