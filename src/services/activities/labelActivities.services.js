const Activity = require("../../models/activities.model");
const Board = require("../../models/boards.model");
const State = require("../../models/states.model");
const Ticket = require("../../models/tickets.model");

const createOrDeleteLabelActivity = async (type, data) => {
  const board = await Board.findById(data.label.board);
  const newActivity = new Activity({
    type: type,
    data: {
      activeUser: data.activeUser,
      object: { _id: data.label._id, name: data.label.name },
      parent: board.name,
    },
    board: board._id,
  });
  await newActivity.save();
};

const updateLabelTitleActivity = async (type, data) => {
  const board = await Board.findById(data.label.board);
  if (Object.keys(data.change).length === 2) {
    const newActivity = new Activity({
      type: type,
      data: {
        activeUser: data.activeUser,
        object: {
          _id: data.label._id,
          name: data.label.name,
          color: data.label.color,
        },
        newObject: {
          _id: data.label._id,
          name: data.change.name,
          color: data.change.color,
        },
        parent: board.name,
      },
      board: board._id,
    });
    await newActivity.save();
  } else if (data.change.name) {
    const newActivity = new Activity({
      type: type,
      data: {
        activeUser: data.activeUser,
        object: {
          _id: data.label._id,
          name: data.label.name,
        },
        newObject: {
          _id: data.label._id,
          name: data.change.name,
        },
        parent: board.name,
      },
      board: board._id,
    });
    await newActivity.save();
  } else if (data.change.color) {
    const newActivity = new Activity({
      type: type,
      data: {
        activeUser: data.activeUser,
        object: {
          _id: data.label._id,
          color: data.label.color,
        },
        newObject: {
          _id: data.label._id,
          color: data.change.color,
        },
        parent: board.name,
      },
      board: board._id,
    });
    await newActivity.save();
  }
};

const assignLabelToTicketActivity = async (type, data) => {
  const ticket = await Ticket.findById(data.ticketId);
  const state = await State.findById(ticket.state);

  const newActivityTicket = new Activity({
    type: type,
    data: {
      activeUser: data.activeUser,
      object: {
        _id: data.label._id,
        name: data.label.name,
      },
      parent: ticket.name,
    },
    board: state.board,
    ticket: ticket._id,
  });
  await newActivityTicket.save();
};

module.exports = {
  createOrDeleteLabelActivity,
  updateLabelTitleActivity,
  assignLabelToTicketActivity,
};
