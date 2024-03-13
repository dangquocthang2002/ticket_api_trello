const Epic = require("../models/epics.model");

const isEpicExist = async (value) => {
  const epic = await Epic.findById(value);
  if (epic || !value) {
    return value;
  } else {
    throw new Error("Epic not found!");
  }
};
const isEpicObject = (id) => Epic.findById(id);
const getBoardIdByEpic = async (value) => {
  const board = (await Epic.findById(value)).board.toString();
  return board;
};
module.exports = { isEpicExist, isEpicObject, getBoardIdByEpic };
