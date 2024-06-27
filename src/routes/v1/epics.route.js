const epicController = require("../../controllers/epics.controller");
const ticketsController = require("../../controllers/tickets.controller");
const { verifyLogin } = require("../../middlewares/auth.middleware");
const boardViewOnly = require("../../middlewares/boardViewOnly.middleware");

const JoiSchemaValidation = require("../../middlewares/validation.middleware");
const {
  getBoardByBoardId,
  getBoardByEpicId,
} = require("../../services/boardsService/getBoardOfEntity.service");
const {
  AddEpicSchema,
  UpdateEpicSchema,
} = require("../../validation/epics.validation");

const router = require("express").Router();

const viewModeOnlyByBoard = boardViewOnly((req) =>
  getBoardByBoardId(req.body.board),
);

const viewModeOnlyByEpic = boardViewOnly((req) =>
  getBoardByEpicId(req.params.id),
);

//Add epic
router.post(
  "/",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  // viewModeOnlyByBoard,
  JoiSchemaValidation(AddEpicSchema),
  epicController.addEpic,
);
//Update epic
router.put(
  "/:id",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByEpic,
  JoiSchemaValidation(UpdateEpicSchema),
  epicController.updateEpic,
);
//Delete epic
router.delete("/:id", verifyLogin(["ADMIN"]), epicController.deleteEpic);
//Get epic By ID
router.get(
  "/:id",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  epicController.getEpicById,
);

//Get ticket By epicID
router.get(
  "/:id/tickets",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  ticketsController.getTicketsByEpicId,
);

module.exports = router;
