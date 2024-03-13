const Label = require("../models/labels.model");
const { ActivityType } = require("../services/activities/activity.constants");
const Activities = require("../services/activities/index");

const { eventEmitter } = require("../services/eventEmitter.service");

const labelsController = {
  //Add a new label
  addLabel: async (req, res) => {
    try {
      const newLabel = new Label(req.body);
      eventEmitter.emit(ActivityType.USER_CREATE_LABEL_TO_BOARD, {
        activeUser: { _id: req.data._id, name: req.data.name },
        label: newLabel,
        boardActive: req.board,
        clientId: req.headers.clientid,
      });
      const saveLabel = await newLabel.save();
      res.status(200).json(saveLabel);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },

  //Show
  showLabels: async (req, res) => {
    try {
      const labels = await Label.find().populate({
        path: "board",
        select: "name description",
        populate: { path: "department", select: "name description" },
      });
      res.status(200).json(labels);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Get label By ID
  getLabelById: async (req, res) => {
    try {
      const label = await Label.findById(req.params.id);
      if (label) {
        res.status(200).json(label);
      } else {
        res.status(404).json({
          message: "Label not found",
        });
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  // Get Label By Board
  getLabelsByBoard: async (req, res) => {
    try {
      const boardId = req.boardId;
      const labels = await Label.find({
        board: boardId,
      });
      res.status(200).json(labels);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },

  //Update
  updateLabel: async (req, res) => {
    try {
      const initLabel = await Label.findById(req.params.id);
      if (req.body.name || req.body.color) {
        eventEmitter.emit(ActivityType.USER_UPDATE_LABEL_INFO, {
          activeUser: { _id: req.data._id, name: req.data.name },
          label: initLabel,
          change: req.body,
          boardActive: req.board,
          clientId: req.headers.clientid,
          labelUpdate: { ...initLabel._doc, ...req.body },
        });
      }
      const label = await Label.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json(label);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Delete
  deleteLabel: async (req, res) => {
    try {
      const { ticketIdDeleteLabel } = req.query || {};
      const label = await Label.findByIdAndDelete(req.params.id);
      if (label) {
        if (ticketIdDeleteLabel) {
          eventEmitter.emit(ActivityType.USER_DELETE_LABEL_OF_BOARD, {
            activeUser: { _id: req.data._id, name: req.data.name },
            label: label,
            boardActive: req.board,
            clientId: req.headers.clientid,
            ticketIdDeleteLabel: ticketIdDeleteLabel,
          });
        }
        res.status(200).json({
          message: "Delete Successfully",
        });
      } else {
        res.status(404).json({ message: "Label not found!" });
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
};

module.exports = labelsController;
