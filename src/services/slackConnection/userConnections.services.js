const slackConnection = require("../../models/slackConnection.model");
const Board = require("../../models/boards.model");
const State = require("../../models/states.model");
const Ticket = require("../../models/tickets.model");
const User = require("../../models/users.model");

const { sendMessage } = require("./sendSlackMessage");

const addUserToBoardConnection = async (type, boardId, data) => {
  const slack = await slackConnection.findOne({ board: boardId });
  const user = await User.findById(data.user[0].user);
  const board = await Board.findById(boardId);
  if (slack?.data.modifyUser) {
    const text = `\n>\`${data.activeUser.name}\` add \`${user.name}\` to board <${process.env.WEB_URL}/#/boards/${board._id}|${board.name}>`;
    sendMessage(text, board, slack, type);
  }
};
const removeUserOutOfBoardConnection = async (type, boardId, data) => {
  const slack = await slackConnection.findOne({ board: boardId });
  const user = await User.findById(data.user[0].user);
  const board = await Board.findById(boardId);
  if (slack?.data.modifyUser) {
    const text = `\n>\`${data.activeUser.name}\` remove \`${user.name}\` out of board <${process.env.WEB_URL}/#/boards/${board._id}|${board.name}>`;
    sendMessage(text, board, slack, type);
  }
};
const addUserToTicketConnection = async (type, ticketId, data) => {
  const user = await User.findById(data.user[0].user);
  const ticket = await Ticket.findById(ticketId);
  const state = await State.findById(ticket.state);
  const slack = await slackConnection.findOne({ board: state.board });
  const board = await Board.findById(state.board);
  if (slack?.data.modifyUser) {
    const text = `\n>\`${data.activeUser.name}\` add \`${user.name}\` to ticket <${process.env.WEB_URL}/#/boards/${board._id}/ticket/${ticket._id}|${ticket.name}>`;
    sendMessage(text, board, slack, type);
  }
};
const removeUserOutOfTicketConnection = async (type, ticketId, data) => {
  const user = await User.findById(data.user[0].user);
  const ticket = await Ticket.findById(ticketId);
  const state = await State.findById(ticket.state);
  const slack = await slackConnection.findOne({ board: state.board });
  const board = await Board.findById(state.board);
  if (slack?.data.modifyUser) {
    const text = `\n>\`${data.activeUser.name}\` remove \`${user.name}\` out of ticket <${process.env.WEB_URL}/#/boards/${board._id}/ticket/${ticket._id}|${ticket.name}>`;
    sendMessage(text, board, slack, type);
  }
};
module.exports = {
  addUserToBoardConnection,
  removeUserOutOfBoardConnection,
  addUserToTicketConnection,
  removeUserOutOfTicketConnection,
};
