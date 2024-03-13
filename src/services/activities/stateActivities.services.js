const Activity = require("../../models/activities.model");
const Board = require("../../models/boards.model");

const addOrDeleteStateActivity = async (type, data) => {
  const board = await Board.findById(data.state.board);
  const newActivity = new Activity({
    type: type,
    data: {
      activeUser: data.activeUser,
      object: { _id: data.state._id, name: data.state.name },
      parent: board.name,
    },
    board: board._id,
  });
  await newActivity.save();
};

const updateStateTitleActivity = async (type, data) => {
  const board = await Board.findById(data.state.board);
  const newActivity = new Activity({
    type: type,
    data: {
      activeUser: data.activeUser,
      object: {
        _id: data.state._id,
        name: data.state.name,
      },
      newObject: {
        _id: data.state._id,
        name: data.change.name,
      },
      parent: board.name,
    },
    board: board._id,
  });
  await newActivity.save();
};

const moveStateActivity = async (type, data) => {
  const board = await Board.findById(data.state.board);
  const newActivity = new Activity({
    type: type,
    data: {
      activeUser: data.activeUser,
      object: {
        _id: data.state._id,
        name: data.state.name,
        positionIndex: data.state.positionIndex,
      },
      newObject: {
        _id: data.state._id,
        name: data.state.name,
        positionIndex: data.change.positionIndex,
      },
      parent: board.name,
    },
    board: board._id,
  });
  await newActivity.save();
};
const archiveOrRestoreStateActivity = async (type, data) => {
  const board = await Board.findById(data.state.board);
  const newActivity = new Activity({
    type: type,
    data: {
      activeUser: data.activeUser,
      object: {
        _id: data.state._id,
        isArchived: data.state.isArchived,
      },
      newObject: {
        _id: data.state._id,
        isArchived: data.change.isArchived,
      },
      parent: board.name,
    },
    board: board._id,
  });
  await newActivity.save();
};
module.exports = {
  addOrDeleteStateActivity,
  updateStateTitleActivity,
  moveStateActivity,
  archiveOrRestoreStateActivity,
};
