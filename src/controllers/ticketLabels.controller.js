const Ticket = require("../models/tickets.model");
const Label = require("../models/labels.model");
const TicketLabels = require("../models/ticketLabels.model");
const { checkLabelExistInTicket } = require("../services/labels.service");
const { ActivityType } = require("../services/activities/activity.constants");

const { eventEmitter } = require("../services/eventEmitter.service");

const ticketsLabelsController = {
  addLabelToTicket: async (req, res) => {
    try {
      const ticketId = req.ticketId;
      const { labelId } = req.body;
      const [ ticketLabelsExist, label, ticket ] = await Promise.all([
        checkLabelExistInTicket(ticketId, labelId),
        Label.findById(labelId),
        Ticket.findById(req.ticketId),
      ]);

      if (ticketLabelsExist) {
        res.status(400).json({
          message: "TicketLabel invalid",
        });
      } else {
        const newTicketLabel = new TicketLabels({
          ticket: ticketId,
          label: labelId,
        });
        eventEmitter.emit(ActivityType.USER_ADD_LABEL_TO_TICKET, {
          activeUser: { _id: req.data._id, name: req.data.name },
          label: label,
          ticketId: ticketId,
          newTicketLabel: newTicketLabel,
          boardActive: req.board,
          clientId: req.headers.clientid,
          ticketActive: ticket,
        });
        await newTicketLabel.save();
        res.status(200).json(newTicketLabel);
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  deleteLabelTicket: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.ticketId);
      if (ticket) {
        const newTicketLabel = await TicketLabels.findById(
          req.params.ticketLabelId
        );
        const newLabel = await Label.findById(newTicketLabel.label.toString());
        eventEmitter.emit(ActivityType.USER_REMOVE_LABEL_OF_TICKET, {
          activeUser: { _id: req.data._id, name: req.data.name },
          label: newLabel,
          ticketId: req.ticketId,
          ticketLabelId: req.params.ticketLabelId,
          boardActive: req.board,
          clientId: req.headers.clientid,
          ticketActive: ticket,
        });

        await TicketLabels.findByIdAndDelete(req.params.ticketLabelId);
        res.status(200).json({ message: "Delete labels successfully" });
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
  getTicketLabels: async (req, res) => {
    try {
      const ticketId = req.ticketId;
      const ticketLabels = await TicketLabels.find({
        ticket: ticketId,
      });
      res.status(200).json({ ticket: ticketId, labels: ticketLabels });
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
};

module.exports = ticketsLabelsController;
