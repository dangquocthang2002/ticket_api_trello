const slackConnection = require("../../models/slackConnection.model");
const Board = require("../../models/boards.model");
const { sendMessage } = require("./sendSlackMessage");

const moveStateConnection = async (type, data) => {
  const slack = await slackConnection.findOne({ board: data.state.board });
  if (slack?.data.move) {
    const board = await Board.findById(slack.board);
    const text = `\n>\`${data.activeUser.name}\` move state \`${data.state.name}\``;
    sendMessage(text, board, slack, type);
  }
};
const addStateConnection = async (type, data) => {
  const slack = await slackConnection.findOne({ board: data.state.board });
  if (slack?.data.create) {
    const board = await Board.findById(slack.board);
    const text = `\n>\`${data.activeUser.name}\` add new state \`${data.state.name}\``;
    sendMessage(text, board, slack, type);
  }
};
const deleteStateConnection = async (type, data) => {
  const slack = await slackConnection.findOne({ board: data.state.board });
  if (slack?.data.delete) {
    const board = await Board.findById(slack.board);
    const text = `\n>\`${data.activeUser.name}\` delete state \`${data.state.name}\` parmanently`;
    sendMessage(text, board, slack, type);
  }
};
const updateStateTitleConnection = async (type, data) => {
  const slack = await slackConnection.findOne({ board: data.state.board });
  if (slack?.data.update) {
    const board = await Board.findById(slack.board);
    const text = `\n>\`${data.activeUser.name}\` update title state from \`${data.state.name}\` to \`${data.change.name}\``;
    sendMessage(text, board, slack, type);
  }
};
const archiveStateConnection = async (type, data) => {
  const slack = await slackConnection.findOne({ board: data.state.board });
  if (slack?.data.archive) {
    const board = await Board.findById(slack.board);
    const text = `\n>\`${data.activeUser.name}\` archive state \`${data.state.name}\``;
    sendMessage(text, board, slack, type);
  }
};
const restoreStateConnection = async (type, data) => {
  const slack = await slackConnection.findOne({ board: data.state.board });
  if (slack?.data.restore) {
    const board = await Board.findById(slack.board);
    const text = `\n>\`${data.activeUser.name}\` restore state \`${data.state.name}\``;
    sendMessage(text, board, slack, type);
  }
};
module.exports = {
  moveStateConnection,
  addStateConnection,
  deleteStateConnection,
  updateStateTitleConnection,
  archiveStateConnection,
  restoreStateConnection,
};
