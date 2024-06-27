const slackConnection = require("../../models/slackConnection.model");
const Board = require("../../models/boards.model");
const State = require("../../models/states.model");
const Ticket = require("../../models/tickets.model");

const { sendMessage } = require("./sendSlackMessage");

const createTaskConnection = async (type, data) => {
  const ticket = await Ticket.findById(data.task.ticket);
  const state = await State.findById(ticket.state);
  const board = await Board.findById(state.board);
  const slack = await slackConnection.findOne({ board: state.board });
  if (slack?.data.create) {
    const text = `\n>\`${data.activeUser.name}\` add task \`${data.task.name}\` to ticket <${process.env.WEB_URL}/#/boards/${board._id}/ticket/${ticket._id}|${ticket.name}>`;
    sendMessage(text, board, slack, type);
  }
};
const deleteTaskConnection = async (type, data) => {
  const ticket = await Ticket.findById(data.task.ticket);
  const state = await State.findById(ticket.state);
  const board = await Board.findById(state.board);
  const slack = await slackConnection.findOne({ board: state.board });
  if (slack?.data.delete) {
    const text = `\n>\`${data.activeUser.name}\` remove task \`${data.task.name}\` out of ticket <${process.env.WEB_URL}/#/boards/${board._id}/ticket/${ticket._id}|${ticket.name}>`;
    sendMessage(text, board, slack, type);
  }
};
const updateTaskTitleConnection = async (type, data) => {
  const ticket = await Ticket.findById(data.task.ticket);
  const state = await State.findById(ticket.state);
  const board = await Board.findById(state.board);
  const slack = await slackConnection.findOne({ board: state.board });
  if (slack?.data.update) {
    const text = `\n>\`${data.activeUser.name}\` update task's title from \`${data.task.name}\` to \`${data.change.name}\` in ticket <${process.env.WEB_URL}/#/boards/${board._id}/ticket/${ticket._id}|${ticket.name}>`;
    sendMessage(text, board, slack, type);
  }
};
const userCompletedTaskConnection = async (type, data) => {
  const ticket = await Ticket.findById(data.task.ticket);
  const state = await State.findById(ticket.state);
  const board = await Board.findById(state.board);
  const slack = await slackConnection.findOne({ board: state.board });
  if (slack?.data.update) {
    const text = `\n>\`${data.activeUser.name}\` mark task \`${data.task.name}\` is completed in ticket <${process.env.WEB_URL}/#/boards/${board._id}/ticket/${ticket._id}|${ticket.name}>`;
    sendMessage(text, board, slack, type);
  }
};
const userUncompletedTaskConnection = async (type, data) => {
  const ticket = await Ticket.findById(data.task.ticket);
  const state = await State.findById(ticket.state);
  const board = await Board.findById(state.board);
  const slack = await slackConnection.findOne({ board: state.board });
  if (slack?.data.update) {
    const text = `\n>\`${data.activeUser.name}\` mark task \`${data.task.name}\` is uncompleted in ticket <${process.env.WEB_URL}/#/boards/${board._id}/ticket/${ticket._id}|${ticket.name}>`;
    sendMessage(text, board, slack, type);
  }
};
module.exports = {
  createTaskConnection,
  deleteTaskConnection,
  updateTaskTitleConnection,
  userCompletedTaskConnection,
  userUncompletedTaskConnection,
};
