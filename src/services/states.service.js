const { unArchivedConditions } = require("../constants/constants");
const State = require("../models/states.model");

const isStateExist = async (value) => {
  const state = await State.findById(value);
  if (state || !value) {
    return value;
  } else {
    throw new Error("State not found!");
  }
};
const isStateObject = (id) => State.findById(id);
const getBoardIdByState = async (value) => {
  const board = (await State.findById(value)).board.toString();
  return board;
};
const getUnarchivedStates = (condition) => {
  return State.find({
    ...condition,
    $or: unArchivedConditions,
  });
};
module.exports = {
  isStateExist,
  isStateObject,
  getBoardIdByState,
  getUnarchivedStates,
};
