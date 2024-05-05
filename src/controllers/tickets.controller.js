const Ticket = require("../models/tickets.model");
const TaskModel = require("../models/tasks.model");
const { ActivityType } = require("../services/activities/activity.constants");
const EpicModel = require("../models/epics.model");

const {
  isStateObject,
  getBoardIdByState,
} = require("../services/states.service");
const { getBoardIdByLabel } = require("../services/labels.service");
const State = require("../models/states.model");
const {
  checkUserAccessTicket,
  getUnarchivedTickets,
  getDetailTicket,
} = require("../services/tickets.service");
const { checkUserInBoard } = require("../services/boards.service");

const { eventEmitter } = require("../services/eventEmitter.service");

const ticketsController = {
  //Add a new Ticket
  addTicket: async (req, res) => {
    const checkTheSameBoard = async (state, label) => {
      return (
        (await getBoardIdByState(state)) == (await getBoardIdByLabel(label))
      );
    };
    try {
      if (req.body.label) {
        if (!checkTheSameBoard(req.body.state, req.body.label)) {
          return res
            .status(400)
            .json({ message: "State and label are not in the same board" });
        }
      }
      const newTicket = new Ticket(req.body);
      eventEmitter.emit(ActivityType.CREATE_NEW_TICKET, {
        activeUser: { _id: req.data._id, name: req.data.name },
        ticket: newTicket,
        boardActive: req.board,
        clientId: req.headers.clientid,
      });
      const saveTicket = await newTicket.save();
      res.status(200).json(saveTicket);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },

  showTickets: async (req, res) => {
    try {
      const tickets = await Ticket.find().populate([{ path: "state" }]);
      res.status(200).json(tickets);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  showTicketsByState: async (req, res) => {
    try {
      const { id: stateId } = req.params;
      const tickets = await getUnarchivedTickets({
        state: stateId,
      });

      const ticketPrivate = tickets.filter((ticket) => ticket.private);

      if (req.data.role !== "ADMIN") {
        const ticketPrivateAccess = await Promise.all(
          ticketPrivate.map(async (ticket) =>
            (await checkUserAccessTicket(req.data, ticket)) ? ticket : null,
          ),
        );
        return res.status(200).json(
          tickets.filter(
            (ticket) =>
              !ticket.private ||
              ticketPrivateAccess
                .filter((ticket) => ticket !== null)
                .map((t) => t._id)
                .includes(ticket._id),
          ),
        );
      }
      res.status(200).json(tickets);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Get Ticket By ID
  getTicketById: async (req, res) => {
    try {
      const ticket = await getDetailTicket(req.ticketId);
      if (ticket) {
        const state = await State.findById(ticket.state);
        if (!(await checkUserInBoard(req.data, String(state.board)))) {
          return res.status(403).json({ message: "You are not in the board" });
        }
        if (!(await checkUserAccessTicket(req.data, ticket))) {
          return res
            .status(403)
            .json({ message: "You are not allowed to access ticket" });
        }
        res.status(200).json(ticket);
      } else {
        res.status(404).json({
          message: "Ticket not found",
        });
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Update
  updateTicket: async (req, res) => {
    const handelError = (code, msg) => res.status(code).json({ message: msg });
    const checkTheSameBoard = async (state, label) => {
      return (
        (await getBoardIdByState(state)) == (await getBoardIdByLabel(label))
      );
    };
    try {
      const ticket = await Ticket.findById(req.ticketId);
      if (!ticket) {
        return handelError(404, "Ticket not found");
      }
      if (!(await checkUserAccessTicket(req.data, ticket))) {
        return res
          .status(403)
          .json({ message: "You are not allowed to access ticket" });
      }
      if (req.body.label && req.body.state) {
        if (!checkTheSameBoard(req.body.state, req.body.label)) {
          return handelError(400, "State and label are not in the same board");
        }
      } else {
        if (req.body.state) {
          const oldState = await isStateObject(ticket.state.toString());
          const newState = await isStateObject(req.body.state);
          if (newState.board.toString() !== oldState.board.toString()) {
            return handelError(
              400,
              "newState and oldState are not in the same board",
            );
          }
        }
        if (req.body.label) {
          if (!checkTheSameBoard(ticket.state.toString(), req.body.label)) {
            return handelError(
              400,
              "State and label are not in the same board",
            );
          }
        }
      }
      const ticketUpdateEvent = { ...ticket._doc, ...req.body };
      if (req.body.name && req.body.name !== ticket.name) {
        eventEmitter.emit(ActivityType.UPDATE_TITLE_TICKET, {
          activeUser: { _id: req.data._id, name: req.data.name },
          ticket: ticket,
          change: req.body,
        });
      }
      if (req.body.state) {
        if (req.body.state !== ticket.state.toString()) {
          eventEmitter.emit(ActivityType.MOVE_TICKET_TO_COLUMN, {
            activeUser: { _id: req.data._id, name: req.data.name },
            ticket: ticket,
            change: req.body,
          });
        }
        eventEmitter.emit(ActivityType.MOVE_TICKET, {
          boardActive: req.board,
          clientId: req.headers.clientid,
          ticketMove: ticketUpdateEvent,
          fromStateId: ticket.state.toString(),
          toStateId: req.body.state,
        });
      } else if (req.body.isArchived === true) {
        eventEmitter.emit(ActivityType.ARCHIVE_TICKET, {
          activeUser: { _id: req.data._id, name: req.data.name },
          ticket: ticket,
          change: req.body,
          boardActive: req.board,
          clientId: req.headers.clientid,
          ticketArchive: ticketUpdateEvent,
        });
      } else if (req.body.isArchived === false) {
        eventEmitter.emit(ActivityType.RESTORE_TICKET, {
          activeUser: { _id: req.data._id, name: req.data.name },
          ticket: ticket,
          change: req.body,
          boardActive: req.board,
          clientId: req.headers.clientid,
          ticketRestore: ticketUpdateEvent,
        });
      } else {
        eventEmitter.emit(ActivityType.UPDATE_TICKET_DETAILS, {
          boardActive: req.board,
          clientId: req.headers.clientid,
          ticketUpdate: ticketUpdateEvent,
        });
      }

      const isMoved =
        Boolean(req.body.state) &&
        String(req.body.state) !== String(ticket.state);
      const newState = await isStateObject(req.body.state);
      const type = newState.isDone
        ? "done"
        : newState.isInProgress
        ? "inProgress"
        : "todo";
      const ticketUpdate = await Ticket.findByIdAndUpdate(
        req.ticketId,
        {
          ...req.body,
          status: type,
          ...(isMoved
            ? {
                movedAt: new Date(),
              }
            : {}),
        },
        {
          new: true,
        },
      );

      return res.status(200).json(ticketUpdate);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Delete
  deleteTicket: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.ticketId);
      if (!ticket) {
        return handelError(404, "Ticket not found");
      }
      if (!(await checkUserAccessTicket(req.data, ticket))) {
        return res
          .status(403)
          .json({ message: "You are not allowed to access ticket" });
      }
      eventEmitter.emit(ActivityType.DELETE_TICKET, {
        activeUser: { _id: req.data._id, name: req.data.name },
        ticket: ticket,
      });
      await Ticket.findByIdAndDelete(ticket._id);
      res.status(200).json({
        message: "Delete Successfully",
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  getTasksByTicket: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.ticketId);
      if (!ticket) {
        return res.status(404).json({
          message: "ticket not found",
        });
      }
      if (!(await checkUserAccessTicket(req.data, ticket))) {
        return res
          .status(403)
          .json({ message: "You are not allowed to access ticket" });
      }
      const tasks = await TaskModel.find({
        ticket: req.ticketId,
      });
      res.status(200).json(tasks);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  getTicketsByEpicId: async (req, res) => {
    try {
      const epic = await EpicModel.findById(req.params.id);
      if (!epic) {
        return res.status(404).json({ message: "epic not found" });
      }
      const tickets = await Ticket.find({ epic: req.params.id }).populate({
        path: "state",
      });
      res.status(200).json({
        epic: epic,
        ticketsEpic: tickets.filter((t) => !t.private),
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Get Archives
  getArchivedTickets: async (req, res) => {
    try {
      const tickets = await Ticket.find({ isArchived: true })
        .populate({
          path: "state",
          select: "name",
          populate: {
            path: "board",
            select: "name description department",
            populate: {
              path: "department",
              select: "name",
            },
          },
        })
        .sort({ updatedAt: "desc" });
      const filteredTickets = tickets.filter(
        (ticket) =>
          ticket.state &&
          ticket.state?.board &&
          ticket.state?.board?.department,
      );
      res.status(200).json(filteredTickets);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
};

module.exports = ticketsController;
