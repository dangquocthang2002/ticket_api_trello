const State = require("../models/states.model");
const { ActivityType } = require("../services/activities/activity.constants");

const { eventEmitter } = require("../services/eventEmitter.service");
const { getUnarchivedStates } = require("../services/states.service");

const statesController = {
  //Add a new state
  addState: async (req, res) => {
    try {
      const newState = new State(req.body);
      eventEmitter.emit(ActivityType.ADD_STATE, {
        activeUser: { _id: req.data._id, name: req.data.name },
        state: newState,
        boardActive: req.board,
        clientId: req.headers.clientid,
      });
      const saveState = await newState.save();
      res.status(200).json(saveState);
    } catch (error) {
      res.status(400).json({
        message: error.message || "Something went wrong!",
      });
    }
  },
  //Show
  showStates: async (req, res) => {
    try {
      const states = await State.find();
      res.status(200).json(states);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Show
  showStatesByBoard: async (req, res) => {
    try {
      const boardId = req.boardId;
      const states = await getUnarchivedStates({ board: boardId });
      res.status(200).json(states);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Get state By ID
  getStateById: async (req, res) => {
    try {
      const state = await State.findById(req.params.id);
      if (state) {
        res.status(200).json(state);
      } else {
        res.status(404).json({
          message: "State not found",
        });
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Update
  updateState: async (req, res) => {
    try {
      const initState = await State.findById(req.params.id);
      const stateUpdateEvent = { ...initState._doc, ...req.body };
      if (req.body.name && req.body.name !== initState.name) {
        eventEmitter.emit(ActivityType.UPDATE_STATE_TITLE, {
          activeUser: { _id: req.data._id, name: req.data.name },
          state: initState,
          change: req.body,
          boardActive: req.board,
          clientId: req.headers.clientid,
          stateUpdate: stateUpdateEvent,
        });
      } else if (
        req.body.positionIndex &&
        req.body.positionIndex !== initState.positionIndex
      ) {
        eventEmitter.emit(ActivityType.MOVE_STATE_POSITION, {
          activeUser: { _id: req.data._id, name: req.data.name },
          state: initState,
          change: req.body,
          boardActive: req.board,
          clientId: req.headers.clientid,
          stateUpdate: stateUpdateEvent,
        });
      } else if (req.body.isArchived === true) {
        eventEmitter.emit(ActivityType.ARCHIVE_STATE, {
          activeUser: { _id: req.data._id, name: req.data.name },
          state: initState,
          change: req.body,
          boardActive: req.board,
          clientId: req.headers.clientid,
          stateArchive: stateUpdateEvent,
        });
      } else if (req.body.isArchived === false) {
        eventEmitter.emit(ActivityType.RESTORE_STATE, {
          activeUser: { _id: req.data._id, name: req.data.name },
          state: initState,
          change: req.body,
          boardActive: req.board,
          clientId: req.headers.clientid,
          stateRestore: stateUpdateEvent,
        });
      } else if (typeof req.body.isDone === "boolean") {
        eventEmitter.emit(ActivityType.MAKE_DONE_STATE, {
          activeUser: { _id: req.data._id, name: req.data.name },
          state: initState,
          change: req.body,
          boardActive: req.board,
          clientId: req.headers.clientid,
          stateUpdate: stateUpdateEvent,
        });
      }
      const state = await State.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json(state);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Delete
  deleteState: async (req, res) => {
    try {
      const state = await State.findByIdAndDelete(req.params.id);
      if (state) {
        eventEmitter.emit(ActivityType.DELETE_STATE, {
          activeUser: { _id: req.data._id, name: req.data.name },
          state: state,
        });
        res.status(200).json({
          message: "Delete Successfully",
        });
      } else {
        res.status(404).json({ message: "State not found!" });
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Get Archives
  getArchivedStates: async (req, res) => {
    try {
      const states = await State.find({ isArchived: true })
        .populate({
          path: "board",
          select: "name description department",
          populate: {
            path: "department",
            select: "name",
          },
        })
        .sort({ updatedAt: "desc" });
      const filteredStates = states.filter(
        (state) => state.board && state.board?.department
      );
      res.status(200).json(filteredStates);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
};

module.exports = statesController;
