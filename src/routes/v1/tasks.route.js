const TasksController = require("../../controllers/tasks.controller");
const { verifyLogin } = require("../../middlewares/auth.middleware");
const boardViewOnly = require("../../middlewares/boardViewOnly.middleware");

const JoiSchemaValidation = require("../../middlewares/validation.middleware");
const {
  getBoardByTaskId,
  getBoardByTicketId,
} = require("../../services/boardsService/getBoardOfEntity.service");
const {
  AddTaskSchema,
  UpdateTaskSchema,
} = require("../../validation/tasks.validation");

const router = require("express").Router();

const viewModeOnlyByTask = boardViewOnly((req) =>
  getBoardByTaskId(req.params.id)
);
const viewModeOnlyByTicket = boardViewOnly((req) =>
  getBoardByTicketId(req.body.ticket)
);
//Add task
router.post(
  "/",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByTicket,
  JoiSchemaValidation(AddTaskSchema),
  TasksController.addTask
);

//Get task By ID
router.get(
  "/:id",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  TasksController.getTaskById
);

//Update task
router.put(
  "/:id",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByTask,
  JoiSchemaValidation(UpdateTaskSchema),
  TasksController.updateTask
);

//Delete ticket
router.delete(
  "/:id",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  viewModeOnlyByTask,
  TasksController.deleteTask
);
module.exports = router;
