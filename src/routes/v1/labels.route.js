const LabelsController = require("../../controllers/labels.controller");
const { verifyLogin } = require("../../middlewares/auth.middleware");
const boardViewOnly = require("../../middlewares/boardViewOnly.middleware");
const JoiSchemaValidation = require("../../middlewares/validation.middleware");
const {
  getBoardByLabelId,
  getBoardByBoardId,
} = require("../../services/boardsService/getBoardOfEntity.service");
const {
  AddLabelSchema,
  UpdateLabelSchema,
} = require("../../validation/labels.validation");

const router = require("express").Router();

const viewModeOnlyByBoard = boardViewOnly((req) =>
  getBoardByBoardId(req.body.board)
);

const viewModeOnlyByLabel = boardViewOnly((req) =>
  getBoardByLabelId(req.params.id)
);

//Add label
router.post(
  "/",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByBoard,
  JoiSchemaValidation(AddLabelSchema),
  LabelsController.addLabel
);

//Show labels
router.get(
  "/",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  LabelsController.showLabels
);

//Get label By ID
router.get(
  "/:id",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  LabelsController.getLabelById
);

//Update label
router.put(
  "/:id",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByLabel,
  JoiSchemaValidation(UpdateLabelSchema),
  LabelsController.updateLabel
);

//Delete label

router.delete(
  "/:id",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByLabel,
  LabelsController.deleteLabel
);
module.exports = router;
