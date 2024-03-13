const Board = require("../models/boards.model");
const BoardInvitedMemberModel = require("../models/boardsInvitedMembers.model");
const DepartmentUserModel = require("../models/departmentsUsers.model");
const TicketLabels = require("../models/ticketLabels.model");
const TicketFiles = require("../models/ticketsFiles.model");
const TicketUsers = require("../models/ticketsUsers.model");
const Task = require("../models/tasks.model");
const { getUnarchivedTickets } = require("./tickets.service");
const { getUnarchivedStates } = require("./states.service");
const { getObjectFromArray } = require("../utils/getObjectFromArray.ulti");
const { unArchivedConditions } = require("../constants/constants");

const isBoardExist = async (value) => {
  const board = await Board.findById(value);
  if (board || !value) {
    return value;
  } else {
    throw new Error("Board not found!");
  }
};

const getBoardById = (id) => {
  return Board.findById(id);
};

const checkMembersNotInBoard = async (userIds, board) => {
  const invitedMembersExit = await BoardInvitedMemberModel.find({
    user: { $in: userIds },
    board: board._id,
  });
  return userIds.filter(
    (userId) =>
      !invitedMembersExit
        .map((invitedMemberBoard) => invitedMemberBoard.user.toString())
        .includes(userId)
  );
};

const checkUserInBoard = async (user, boardId) => {
  try {
    if (user.role === "ADMIN") {
      return true;
    }

    const board = await Board.findById(boardId);

    if (!board) {
      return false;
    }
    const userDepartment = await DepartmentUserModel.findOne({
      userId: user._id,
      departmentId: board.department,
    });

    if (!userDepartment) {
      const userBoard = await BoardInvitedMemberModel.findOne({
        user: user._id,
        board: boardId,
      });

      return userBoard ? true : false;
    } else {
      return true;
    }
  } catch (error) {
    return false;
  }
};

const getFullMembersOfBoard = async (boardId) => {
  try {
    const board = await Board.findById(boardId).populate({
      path: "department",
      select: "name description",
    });
    if (!board) {
      return false;
    }
    const invitedMembersInBoard = await BoardInvitedMemberModel.find({
      board: boardId,
    })
      .select("-_id -board -__v -createdAt -updatedAt")
      .exec();
    const usersInBoard = await DepartmentUserModel.find({
      departmentId: board.department._id.toString(),
    })
      .select("-_id -departmentId -__v -createdAt -updatedAt")
      .exec();
    return {
      board: board,
      invitedMembers: invitedMembersInBoard
        .filter((user) => (user.user ? true : false))
        .map((user) => user.user.toString()),
      usersInBoard: usersInBoard
        .filter((user) => (user.userId ? true : false))
        .map((user) => user.userId.toString()),
    };
  } catch (error) {
    return false;
  }
};
const getUnarchivedBoards = (condition) => {
  return Board.find({
    ...condition,
    $or: unArchivedConditions,
  });
};
const getTicketsByBoard = async (boardId) => {
  try {
    const board = await Board.findById(boardId);
    if (!board) {
      throw new Error("Board not found!");
    }
    const states = await getUnarchivedStates({ board: boardId });
    const tickets = await getUnarchivedTickets({
      state: {
        $in: states.map((state) => state._id),
      },
    });
    const ticketIds = tickets.map((ticket) => ticket._id);
    const {
      ticketLabelsOfBoard,
      ticketFilesOfBoard,
      ticketUsersOfBoard,
      tasksInTicket,
    } = await Promise.all([
      TicketLabels.find({ ticket: { $in: ticketIds } }),
      TicketFiles.find({ ticket: { $in: ticketIds } }).populate({
        path: "file",
      }),
      TicketUsers.find({ ticket: { $in: ticketIds } }).populate({
        path: "user",
        populate: {
          path: "avatar",
        },
      }),
      Task.find({ ticket: { $in: ticketIds } }),
    ]).then((res) => ({
      ticketLabelsOfBoard: res[0],
      ticketFilesOfBoard: res[1],
      ticketUsersOfBoard: res[2].filter((item) => item.user),
      tasksInTicket: res[3],
    }));

    const ticketLabelsObject = getObjectFromArray(
      ticketLabelsOfBoard,
      "ticket"
    );
    const ticketFilesObject = getObjectFromArray(ticketFilesOfBoard, "ticket");
    const ticketUsersObject = getObjectFromArray(ticketUsersOfBoard, "ticket");
    const ticketTasksObject = getObjectFromArray(tasksInTicket, "ticket");
    const data = tickets.map((ticket) => ({
      ...ticket._doc,
      labels: ticketLabelsObject[ticket._id] || [],
      members: ticketUsersObject[ticket._id]?.map((item) => item.user) || [],
      attachments:
        ticketFilesObject[ticket._id]?.map((item) => ({
          ...item.file,
          isCovered: item.isCovered,
        })) || [],
      tasks: ticketTasksObject[ticket._id] || [],
    }));
    return data;
  } catch (error) {
    throw new Error("Something went wrong!");
  }
};

module.exports = {
  getUnarchivedBoards,
  isBoardExist,
  checkMembersNotInBoard,
  checkUserInBoard,
  getFullMembersOfBoard,
  getTicketsByBoard,
  getBoardById
};
