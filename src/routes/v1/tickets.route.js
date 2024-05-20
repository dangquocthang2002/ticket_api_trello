const multer = require("multer");
const TicketsController = require("../../controllers/tickets.controller");
const { verifyLogin } = require("../../middlewares/auth.middleware");
const JoiSchemaValidation = require("../../middlewares/validation.middleware");
const {
  AddTicketSchema,
  UpdateTicketSchema,
} = require("../../validation/tickets.validation");

const ticketsUsersController = require("../../controllers/ticketsUsers.controller");
const ticketsLabelsController = require("../../controllers/ticketLabels.controller");
const fileController = require("../../controllers/files.controller");
const handleFile = require("../../middlewares/handleFile.middleware");

const {
  getBoardByStateId,
  getBoardByTicketId,
} = require("../../services/boardsService/getBoardOfEntity.service");
const boardViewOnly = require("../../middlewares/boardViewOnly.middleware");
const githubConnectionController = require("../../controllers/githubConnection.controller");
const router = require("express").Router();

const ticketDetailsRouter = require("express").Router();

const viewModeOnlyByState = boardViewOnly((req) =>
  getBoardByStateId(req.body.state),
);

const viewModeOnlyByTicket = boardViewOnly((req) =>
  getBoardByTicketId(req.ticketId),
);

//Add ticket
router.post(
  "/",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByState,
  JoiSchemaValidation(AddTicketSchema),
  TicketsController.addTicket,
);

router.use(
  "/:id",
  (req, res, next) => {
    req.ticketId = req.params.id;
    next();
  },
  ticketDetailsRouter,
);

//Get ticket By ID
ticketDetailsRouter.get(
  "/",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  TicketsController.getTicketById,
);
//Delete ticket
ticketDetailsRouter.delete(
  "/",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByTicket,
  TicketsController.deleteTicket,
);
// Update ticket
ticketDetailsRouter.put(
  "/",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByTicket,
  JoiSchemaValidation(UpdateTicketSchema),
  TicketsController.updateTicket,
);
ticketDetailsRouter.get(
  "/tasks",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  TicketsController.getTasksByTicket,
);

// users ticket

ticketDetailsRouter.post(
  "/users",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByTicket,
  ticketsUsersController.addUserToTicket,
);
ticketDetailsRouter.get(
  "/users",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  ticketsUsersController.getUsersTicket,
);
ticketDetailsRouter.delete(
  "/users",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByTicket,
  ticketsUsersController.deleteUsersTicket,
);

// labels ticket

ticketDetailsRouter.post(
  "/labels",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByTicket,
  ticketsLabelsController.addLabelToTicket,
);

ticketDetailsRouter.get(
  "/labels",
  verifyLogin(["ADMIN", "LEADER", "USER"]),

  ticketsLabelsController.getTicketLabels,
);

ticketDetailsRouter.delete(
  "/labels/:ticketLabelId",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByTicket,

  ticketsLabelsController.deleteLabelTicket,
);

// Upload Files
ticketDetailsRouter.post(
  "/files",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByTicket,
  multer({ storage: multer.memoryStorage() }).array("filesUpload"),
  handleFile(),
  fileController.addFiles,
);

ticketDetailsRouter.get(
  "/files",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  fileController.getFilesByTicket,
);
ticketDetailsRouter.delete(
  "/files/:fileId",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByTicket,
  fileController.removeFileFromTicket,
);
ticketDetailsRouter.put(
  "/files/:fileId",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByTicket,

  fileController.updateFile,
);

ticketDetailsRouter.get(
  "/pull-requests",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  githubConnectionController.getPullRequestsInTicket,
);
ticketDetailsRouter.get(
  "/check-commits",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  githubConnectionController.checkCommitsInTicket,
);
module.exports = router;
