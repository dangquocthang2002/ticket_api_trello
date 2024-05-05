const EpicModel = require("../models/epics.model");
const StateModel = require("../models/states.model");

const BoardModel = require("../models/boards.model");
const TicketModel = require("../models/tickets.model");
const { eventEmitter } = require("../services/eventEmitter.service");
const { ActivityType } = require("../services/activities/activity.constants");

const epicController = {
  getEpicsByBoardId: async (req, res) => {
    try {
      const board = await BoardModel.findById(req.boardId);
      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }

      const { epics, states } = await Promise.all([
        EpicModel.find({
          board: req.boardId.toString(),
        }),
        StateModel.find({
          board: req.boardId.toString(),
        }),
      ]).then((data) => ({
        epics: data[0],
        states: data[1],
      }));
      const ticketsOfEpics = await Promise.all(
        epics.map(async (epic) => {
          const tickets = await TicketModel.find({
            epic: epic._id,
          });
          return {
            ...epic._doc,
            tickets: tickets
              .filter((t) => !t.private)
              .filter((t) => !t.isArchived)
              .filter((ticket) =>
                states
                  .map((state) => String(state._id))
                  .includes(String(ticket.state))
                  ? true
                  : false,
              ),
          };
        }),
      );
      res.status(200).json({
        board: board,
        epicsBoard: ticketsOfEpics,
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  addEpic: async (req, res) => {
    try {
      const newEpic = new EpicModel(req.body);
      eventEmitter.emit(ActivityType.ADD_EPIC_TO_BOARD, {
        boardActive: req.board,
        clientId: req.headers.clientid,
        newEpic: newEpic,
      });
      const epic = await newEpic.save();
      res.status(200).json(epic);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  getEpicById: async (req, res) => {
    try {
      const epic = await EpicModel.findById(req.params.id);
      if (!epic) {
        return res.status(404).json({ message: "epic not found" });
      }
      res.status(200).json("add epic successfully");
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  updateEpic: async (req, res) => {
    try {
      const epic = await EpicModel.findById(req.params.id);
      if (!epic) {
        return res.status(404).json({ message: "epic not found" });
      }
      eventEmitter.emit(ActivityType.UPDATE_EPIC_IN_BOARD, {
        boardActive: req.board,
        clientId: req.headers.clientid,
        epicUpdate: { ...epic._doc, ...req.body },
      });
      const epicUpdate = await EpicModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        },
      );
      res.status(200).json(epicUpdate);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  deleteEpic: async (req, res) => {
    try {
      const epic = await EpicModel.findByIdAndDelete(req.params.id);

      if (epic) {
        eventEmitter.emit(ActivityType.DELETE_EPIC_FROM_BOARD, {
          boardIdActive: String(epic.board),
          clientId: req.headers.clientid,
          epicDelete: epic,
        });
        res.status(200).json({
          message: "Delete Successfully",
        });
      } else {
        res.status(404).json({ message: "Epic not found!" });
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
};
module.exports = epicController;
