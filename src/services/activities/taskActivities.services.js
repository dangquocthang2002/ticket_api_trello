const Activity = require("../../models/activities.model");
const State = require("../../models/states.model");
const Ticket = require("../../models/tickets.model");

const createOrDeleteTaskActivity = async (type, data) => {
  const ticket = await Ticket.findById(data.task.ticket);
  const state = await State.findById(ticket.state);

  const newActivity = new Activity({
    type: type,
    data: {
      activeUser: data.activeUser,
      object: { _id: data.task._id, name: data.task.name },
      parent: ticket.name,
    },
    board: state.board,
    ticket: ticket._id,
  });
  await newActivity.save();
};
const updateTaskTitleActivity = async (type, data) => {
  const ticket = await Ticket.findById(data.task.ticket);
  const state = await State.findById(ticket.state);

  const newActivity = new Activity({
    type: type,
    data: {
      activeUser: data.activeUser,
      object: {
        _id: data.task._id,
        name: data.task.name,
      },
      newObject: {
        _id: data.task._id,
        name: data.change.name,
      },
      parent: ticket.name,
    },
    board: state.board,
    ticket: ticket._id,
  });
  await newActivity.save();
};
const updateTaskProgressActivity = async (type, data) => {
  const ticket = await Ticket.findById(data.task.ticket);
  const state = await State.findById(ticket.state);

  const newActivity = new Activity({
    type: type,
    data: {
      activeUser: data.activeUser,
      object: {
        _id: data.task._id,
        name: data.task.name,
        status: data.task.status,
      },
      newObject: {
        _id: data.task._id,
        name: data.task.name,
        status: data.change.status,
      },
      parent: ticket.name,
    },
    board: state.board,
    ticket: ticket._id,
  });
  await newActivity.save();
};
module.exports = {
  createOrDeleteTaskActivity,
  updateTaskTitleActivity,
  updateTaskProgressActivity,
};
