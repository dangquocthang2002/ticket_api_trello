const slackConnection = require("../../models/slackConnection.model");
const Board = require("../../models/boards.model");
const State = require("../../models/states.model");
const Ticket = require("../../models/tickets.model");
const { sendMessage } = require("./sendSlackMessage");
const createLabelConnection = async (type, data) => {
  const slack = await slackConnection.findOne({ board: data.label.board });
  if (slack?.data.create) {
    const board = await Board.findById(slack.board);
    const text = `\n>\`${data.activeUser.name}\` add new label \`${data.label.name}\``;
    sendMessage(text, board, slack, type);
  }
};
const deleteLabelConnection = async (type, data) => {
  const slack = await slackConnection.findOne({ board: data.label.board });
  if (slack?.data.delete) {
    const board = await Board.findById(slack.board);
    const text = `\n>\`${data.activeUser.name}\` remove label \`${data.label.name}\``;
    sendMessage(text, board, slack, type);
  }
};
const updateLabelConnection = async (type, data) => {
  const slack = await slackConnection.findOne({ board: data.label.board });
  if (slack?.data.update) {
    const board = await Board.findById(slack.board);
    const text = `\n>\`${data.activeUser.name}\` update information in label \`${data.label.name}\``;
    sendMessage(text, board, slack, type);
  }
};
const assignLabelToTicketConnection = async (type, data) => {
  const ticket = await Ticket.findById(data.ticketId);
  const state = await State.findById(ticket.state);
  const board = await Board.findById(state.board);
  const slack = await slackConnection.findOne({ board: state.board });

  if (slack?.data.assignLabel) {
    const text = `\n>\`${data.activeUser.name}\` add label \`${data.label.name}\` to ticket <${process.env.WEB_URL}/#/boards/${board._id}/ticket/${ticket._id}|${ticket.name}>`;
    sendMessage(text, board, slack, type);
  }
};
const removeLabelOutOfTicketConnection = async (type, data) => {
  const ticket = await Ticket.findById(data.ticketId);
  const state = await State.findById(ticket.state);
  const board = await Board.findById(state.board);
  const slack = await slackConnection.findOne({ board: state.board });

  if (slack?.data.assignLabel) {
    const text = `\n>\`${data.activeUser.name}\` remove label \`${data.label.name}\` out of ticket <${process.env.WEB_URL}/#/boards/${board._id}/ticket/${ticket._id}|${ticket.name}>`;
    sendMessage(text, board, slack, type);
  }
};
module.exports = {
  createLabelConnection,
  deleteLabelConnection,
  updateLabelConnection,
  assignLabelToTicketConnection,
  removeLabelOutOfTicketConnection,
};
