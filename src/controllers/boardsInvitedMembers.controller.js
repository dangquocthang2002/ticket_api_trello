const BoardInvitedMemberModel = require("../models/boardsInvitedMembers.model");
const BoardModel = require("../models/boards.model");
const { checkUsersExit } = require("../services/users.service");
const { checkMembersNotInBoard } = require("../services/boards.service");
const UserModel = require("../models/users.model");
const DepartmentModel = require("../models/departments.model");
const DepartmentUserModel = require("../models/departmentsUsers.model");
const { ActivityType } = require("../services/activities/activity.constants");

const { eventEmitter } = require("../services/eventEmitter.service");

const boardsInvitedMembersController = {
  addInvitedMembersToBoard: async (req, res) => {
    const handleRes = (code, msg) => res.status(code).json({ message: msg });
    try {
      const board = req.board || (await BoardModel.findById(req.boardId));

      if (!board) {
        return handleRes(404, "Board not found");
      }
      const users = await checkUsersExit(req.body.users);
      if (!(users.length > 0)) {
        return handleRes(401, "invitedMembers invalid");
      }
      const newUsers = await checkMembersNotInBoard(
        users.map((user) => user._id),
        board
      );
      if (!(newUsers.length > 0)) {
        return handleRes(200, "invitedMembers exits in this board");
      }
      const newBoardsMembers = [];
      for (let newUser of newUsers) {
        newBoardsMembers.push(
          new BoardInvitedMemberModel({
            user: newUser,
            board: board._id,
          })
        );
      }
      eventEmitter.emit(ActivityType.ADD_USER_TO_BOARD, req.boardId, {
        activeUser: { _id: req.data._id, name: req.data.name },
        user: newBoardsMembers,
        boardActive: req.board,
        newUsers: users.filter((user) => newUsers.includes(user._id)),
        clientId: req.headers.clientid,
      });
      await BoardInvitedMemberModel.insertMany(newBoardsMembers);
      handleRes(200, "invitedMembers is added successfully");
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  deleteInvitedMembersFromBoard: async (req, res) => {
    try {
      const board = req.board || (await BoardModel.findById(req.boardId));
      if (board) {
        const deletedUsers = await BoardInvitedMemberModel.find({
          board: req.boardId,
          user: { $in: req.body.users },
        });
        eventEmitter.emit(ActivityType.REMOVE_USER_OUT_OF_BOARD, req.boardId, {
          activeUser: { _id: req.data._id, name: req.data.name },
          user: deletedUsers,
          boardActive: req.board,
          clientId: req.headers.clientid,
          usersDelete: req.body.users,
        });
        await BoardInvitedMemberModel.deleteMany({
          board: req.boardId,
          user: { $in: req.body.users },
        });
        res.status(200).json({ message: "Delete invitedMembers successfully" });
      } else {
        res.status(404).json({
          message: "Board not found",
        });
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  getInvitedMembersOfBoard: async (req, res) => {
    try {
      const board = await BoardModel.findById(req.boardId).populate({
        path: "department",
        select: "name description",
      });
      const membersInBoard = await BoardInvitedMemberModel.find({
        board: req.boardId,
      })
        .populate({
          path: "user",
          select: "name email role",
          populate: {
            path: "avatar",
          },
        })
        .select("-_id -board")
        .exec();
      if (!board) {
        return res.status(404).json({
          message: "Board not found",
        });
      }
      res.status(200).json({
        board: board,
        invitedMembers: membersInBoard.filter((user) =>
          user.user ? true : false
        ),
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  getListBoardsOfInvitedMember: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id).select("-password");
      const boardsOfInvitedUser = (
        await BoardInvitedMemberModel.find({
          user: req.params.id,
        })
          .populate({
            path: "board",
            populate: {
              path: "department",
            },
          })
          .select("-_id -user -createdAt -updatedAt -__v")
          .exec()
      ).filter((board) =>
        board.board.isArchived
          ? false
          : board.board?.department
          ? board.board?.department?.isArchived
            ? false
            : true
          : false
      );

      if (!user) {
        return res.status(404).json({
          message: "invitedMember not found",
        });
      }
      const guestDepartments = await DepartmentModel.find({
        _id: {
          $in: boardsOfInvitedUser.map((board) => board.board.department),
        },
      });
      const departmentsOfUser = await DepartmentUserModel.find({
        userId: req.params.id,
        departmentId: {
          $in: guestDepartments.map((guestDepartment) => guestDepartment._id),
        },
      });
      res.status(200).json({
        invitedMember: user,
        boards: boardsOfInvitedUser,
        guestDepartments: guestDepartments.filter((department) =>
          departmentsOfUser
            .map((departmentUser) => departmentUser.departmentId.toString())
            .includes(department._id.toString())
            ? false
            : true
        ),
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
};

module.exports = boardsInvitedMembersController;
