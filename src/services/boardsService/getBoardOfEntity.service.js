const BoardModel = require("../../models/boards.model");
const EpicModel = require("../../models/epics.model");
const LabelModel = require("../../models/labels.model");
const StateModel = require("../../models/states.model");
const TicketModel = require("../../models/tickets.model");
const TaskModel = require("../../models/tasks.model");

exports.getBoardByBoardId = async (BoardId) =>
  (await BoardModel.findById(BoardId)) || null;
exports.getBoardByEpicId = async (epicId) =>
  (
    await EpicModel.findById(epicId).populate({
      path: "board",
    })
  )?.board || null;
exports.getBoardByLabelId = async (labelId) =>
  (
    await LabelModel.findById(labelId).populate({
      path: "board",
    })
  )?.board || null;
exports.getBoardByStateId = async (stateId) =>
  (
    await StateModel.findById(stateId).populate({
      path: "board",
    })
  )?.board || null;
exports.getBoardByTicketId = async (ticketId) =>
  (
    await TicketModel.findById(ticketId).populate({
      path: "state",
      populate: {
        path: "board",
      },
    })
  )?.state?.board || null;
exports.getBoardByTaskId = async (taskId) =>
  (
    await TaskModel.findById(taskId).populate({
      path: "ticket",
      populate: {
        path: "state",
        populate: {
          path: "board",
        },
      },
    })
  )?.ticket?.state?.board || null;
