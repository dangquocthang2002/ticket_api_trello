const Activity = require("../../models/activities.model");
const State = require("../../models/states.model");

const addOrDeleteTicketActivity = async (type, data) => {
  const state = await State.findById(data.ticket.state);
  const newActivity = new Activity({
    type: type,
    data: {
      activeUser: data.activeUser,
      object: { _id: data.ticket._id, name: data.ticket.name },
      parent: state.name,
    },
    board: state.board,
    ticket: data.ticket._id,
  });
  await newActivity.save();
};

const updateTicketTitleActivity = async (type, data) => {
  const state = await State.findById(data.ticket.state);
  const newActivity = new Activity({
    type: type,
    data: {
      activeUser: data.activeUser,
      object: {
        _id: data.ticket._id,
        name: data.ticket.name,
      },
      newObject: {
        _id: data.ticket._id,
        name: data.change.name,
      },
      parent: state.name,
    },
    board: state.board,
    ticket: data.ticket._id,
  });
  await newActivity.save();
};

const moveTicketActivity = async (type, data) => {
  const oldState = await State.findById(data.ticket.state);
  const newState = await State.findById(data.change.state);
  const newActivity = new Activity({
    type: type,
    data: {
      activeUser: data.activeUser,
      object: {
        _id: data.ticket._id,
        name: data.ticket.name,
      },
      oldParent: { _id: oldState._id, name: oldState.name },
      newParent: { _id: newState._id, name: newState.name },
    },
    board: oldState.board,
    ticket: data.ticket._id,
  });
  await newActivity.save();
};
const archiveOrRestoreTicketActivity = async (type, data) => {
  const state = await State.findById(data.ticket.state);
  const newActivity = new Activity({
    type: type,
    data: {
      activeUser: data.activeUser,
      object: {
        _id: data.ticket._id,
        isArchived: data.ticket.isArchived,
      },
      newObject: {
        _id: data.ticket._id,
        isArchived: data.change.isArchived,
      },
      parent: state.name,
    },
    board: state.board,
    ticket: data.ticket._id,
  });
  await newActivity.save();
};
module.exports = {
  addOrDeleteTicketActivity,
  updateTicketTitleActivity,
  moveTicketActivity,
  archiveOrRestoreTicketActivity,
};
