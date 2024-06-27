const Board = require("../models/boards.model");
const Department = require("../models/departments.model");
const DepartmentUserModel = require("../models/departmentsUsers.model");
const BoardInvitedMemberModel = require("../models/boardsInvitedMembers.model");
const {
  getTicketsByBoard,
  getUnarchivedBoards,
} = require("../services/boards.service");
const { checkUserAccessTicket } = require("../services/tickets.service");
const boardController = {
  //Add a new board
  addBoard: async (req, res) => {
    try {
      const newBoard = new Board(req.body);
      const saveBoard = await newBoard.save();
      res.status(200).json(saveBoard);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Show
  showBoards: async (req, res) => {
    try {
      const boards = await Board.find().populate({
        path: "department",
        select: "name description",
      });
      res.status(200).json(boards);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Get Board By ID
  getBoardById: async (req, res) => {
    try {
      const board = await Board.findById(req.boardId);
      if (board) {
        res.status(200).json(board);
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
  getBoardByDepartmentId: async (req, res) => {
    try {
      const detailDepartment = await Department.findById(req.params.id);
      if (!detailDepartment) {
        return res.status(404).json({ message: "department not found" });
      }
      const boards = await getUnarchivedBoards({
        department: req.params.id,
      });
      if (req.data.role !== "ADMIN") {
        const departmentUser = await DepartmentUserModel.findOne({
          userId: req.data._id,
          departmentId: req.params.id,
        });
        if (!departmentUser) {
          const boardsOfInvitedUser = await BoardInvitedMemberModel.find({
            user: req.data._id,
            board: { $in: boards.map((board) => String(board._id)) },
          });
          return res.status(200).json({
            department: detailDepartment,
            boards: boards.filter((board) =>
              boardsOfInvitedUser
                .map((userBoard) => String(userBoard.board))
                .includes(String(board._id))
            ),
          });
        }
      }
      res.status(200).json({ department: detailDepartment, boards: boards });
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Update
  updateBoard: async (req, res) => {
    try {
      const board = await Board.findByIdAndUpdate(req.boardId, req.body, {
        new: true,
      });
      res.status(200).json(board);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Delete
  deleteBoard: async (req, res) => {
    try {
      const board = await Board.findByIdAndDelete(req.boardId);
      if (board) {
        res.status(200).json({
          message: "Delete Successfully",
        });
      } else {
        res.status(404).json({ message: "Board not found!" });
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Get Archives
  getArchivedBoards: async (req, res) => {
    try {
      const boards = await Board.find({ isArchived: true })
        .populate({
          path: "department",
          select: "name description",
        })
        .sort({ updatedAt: "desc" });
      const filteredBoards = boards.filter(
        (board) => board.department !== null
      );
      res.status(200).json(filteredBoards);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  getTicketsInBoard: async (req, res) => {
    try {
      const tickets = await getTicketsByBoard(req.boardId);
      if (req.data.role !== "ADMIN") {
        const ticketPrivate = tickets.filter((ticket) => ticket.private);
        const ticketPrivateAccess = await Promise.all(
          ticketPrivate.map(async (ticket) =>
            (await checkUserAccessTicket(req.data, ticket)) ? ticket : null
          )
        );
        return res.status(200).json(
          tickets.filter(
            (ticket) =>
              !ticket.private ||
              ticketPrivateAccess
                .filter((ticket) => ticket !== null)
                .map((t) => t._id)
                .includes(ticket._id)
          )
        );
      }
      res.status(200).json(tickets);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },

  getTicketsDoneInBoard: async (req, res) => {
    try {
      const ticketss = await getTicketsByBoard(req.boardId);
      const tickets = ticketss?.filter((ticket) => {
        if (ticket.status === "done") {
          return ticket.members
            .map((member) => String(member?._id))
            ?.includes(String(req.data._id));
        } else {
          return false;
        }
      });
      if (req.data.role !== "ADMIN") {
        const ticketPrivate = tickets.filter((ticket) => ticket.private);
        const ticketPrivateAccess = await Promise.all(
          ticketPrivate.map(async (ticket) =>
            (await checkUserAccessTicket(req.data, ticket)) ? ticket : null
          )
        );
        return res.status(200).json(
          tickets.filter(
            (ticket) =>
              !ticket.private ||
              ticketPrivateAccess
                .filter((ticket) => ticket !== null)
                .map((t) => t._id)
                .includes(ticket._id)
          )
        );
      }
      res.status(200).json(tickets);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
};

module.exports = boardController;
