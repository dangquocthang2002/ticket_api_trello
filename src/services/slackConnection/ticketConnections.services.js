const slackConnection = require("../../models/slackConnection.model");
const State = require("../../models/states.model");
const Board = require("../../models/boards.model");
const { sendMessage } = require("./sendSlackMessage");
const moveTicketConnection = async (type, data) => {
  const state = await State.findById(data.ticket.state);
  const slack = await slackConnection.findOne({ board: state.board });
  if (slack?.data.move) {
    const board = await Board.findById(slack.board);
    const oldState = await State.findById(data.ticket.state);
    const newState = await State.findById(data.change.state);
    if (slack.data.move.moveApplyFor?.includes(newState._id.toString())) {
      const text = `\n>\`${data.activeUser.name}\` move ticket <${process.env.WEB_URL}/boards/${board._id}/ticket/${data.ticket._id}|${data.ticket.name}> from \`${oldState.name}\` to \`${newState.name}\``;
      sendMessage(text, board, slack, type);
    }
  }
};
const addTicketConnection = async (type, data) => {
  const state = await State.findById(data.ticket.state);
  const slack = await slackConnection.findOne({ board: state.board });
  if (slack?.data.create) {
    const board = await Board.findById(slack.board);
    const text = `\n>\`${data.activeUser.name}\` add new ticket <${process.env.WEB_URL}/boards/${board._id}/ticket/${data.ticket._id}|${data.ticket.name}> in state \`${state.name}\``;
    sendMessage(text, board, slack, type);
  }
};
const deleteTicketConnection = async (type, data) => {
  const state = await State.findById(data.ticket.state);
  const slack = await slackConnection.findOne({ board: state.board });
  if (slack?.data.delete) {
    const board = await Board.findById(slack.board);
    const text = `\n>\`${data.activeUser.name}\` delete ticket <${process.env.WEB_URL}/boards/${board._id}/ticket/${data.ticket._id}|${data.ticket.name}> permanently`;
    sendMessage(text, board, slack, type);
  }
};
const updateTicketTitleConnection = async (type, data) => {
  const state = await State.findById(data.ticket.state);
  const slack = await slackConnection.findOne({ board: state.board });
  if (slack?.data.update) {
    const board = await Board.findById(slack.board);
    const text = `\n>\`${data.activeUser.name}\` update title ticket from \`${data.ticket.name}\` to <${process.env.WEB_URL}/boards/${board._id}/ticket/${data.ticket._id}|${data.change.name}>`;
    sendMessage(text, board, slack, type);
  }
};
const archiveTicketConnection = async (type, data) => {
  const state = await State.findById(data.ticket.state);
  const slack = await slackConnection.findOne({ board: state.board });
  if (slack?.data.archive) {
    const board = await Board.findById(slack.board);
    const text = `\n>\`${data.activeUser.name}\` archive ticket <${process.env.WEB_URL}/boards/${board._id}/ticket/${data.ticket._id}|${data.ticket.name}>`;
    sendMessage(text, board, slack, type);
  }
};
const restoreTicketConnection = async (type, data) => {
  const state = await State.findById(data.ticket.state);
  const slack = await slackConnection.findOne({ board: state.board });
  if (slack?.data.restore) {
    const board = await Board.findById(slack.board);
    const text = `\n>\`${data.activeUser.name}\` restore ticket <${process.env.WEB_URL}/boards/${board._id}/ticket/${data.ticket._id}|${data.ticket.name}> back to state \`${state.name}\``;
    sendMessage(text, board, slack, type);
  }
};
module.exports = {
  moveTicketConnection,
  addTicketConnection,
  deleteTicketConnection,
  updateTicketTitleConnection,
  archiveTicketConnection,
  restoreTicketConnection,
};
