const User = require("../models/users.model");
const Ticket = require("../models/tickets.model");
const TicketUser = require("../models/ticketsUsers.model");
const State = require("../models/states.model");
const { checkUsersExit } = require("../services/users.service");
const {
  checkUsersNotInTicket,
  checkUserAccessTicket,
} = require("../services/tickets.service");
const { ActivityType } = require("../services/activities/activity.constants");
const { getFullMembersOfBoard } = require("../services/boards.service");

const { eventEmitter } = require("../services/eventEmitter.service");

const ticketsUsersController = {
  addUserToTicket: async (req, res) => {
    const handelError = (code, msg) => res.status(code).json({ message: msg });

    try {
      const ticket = await Ticket.findById(req.ticketId);
      if (!ticket) {
        return handelError(404, "Ticket not found.");
      }
      if (!(await checkUserAccessTicket(req.data, ticket))) {
        return res
          .status(403)
          .json({ message: "You are not allowed to access ticket" });
      }
      const users = await checkUsersExit(req.body.users);
      if (!(users.length > 0)) {
        return handelError(401, "User invalid");
      }

      const newUsers = await checkUsersNotInTicket(
        users.map((user) => user._id),
        ticket
      );
      if (!(newUsers.length > 0) || users.length !== newUsers.length) {
        return handelError(400, "User existed in this ticket");
      }

      const state = await State.findById(ticket.state.toString());
      const boardsInvitedMembers = await getFullMembersOfBoard(
        state.board.toString()
      );
      const fullMembersOfBoard = Array.from(
        new Set([
          ...[...boardsInvitedMembers["invitedMembers"]],
          ...[...boardsInvitedMembers["usersInBoard"]],
        ])
      );
      if (!newUsers.every((user) => fullMembersOfBoard.includes(user))) {
        return handelError(400, "User not existed in this board");
      }
      const newUsersTicket = [];
      for (let newUser of newUsers) {
        newUsersTicket.push(
          new TicketUser({
            user: newUser,
            ticket: ticket._id,
          })
        );
      }
      eventEmitter.emit(ActivityType.ADD_USER_TO_TICKET, req.ticketId, {
        activeUser: { _id: req.data._id.toString(), name: req.data.name },
        user: newUsersTicket,
        boardActive: req.board,
        clientId: req.headers.clientid,
        newUsersTicket: {
          users: users.filter((user) => newUsers.includes(user._id)),
          ticketId: String(ticket._id),
        },
        ticketActive: ticket,
      });
      await TicketUser.insertMany(newUsersTicket);
      res.status(200).json({ message: "User is added successfully" });
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  deleteUsersTicket: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.ticketId);
      if (!(await checkUserAccessTicket(req.data, ticket))) {
        return res
          .status(403)
          .json({ message: "You are not allowed to access ticket" });
      }
      if (ticket) {
        const deletedUsers = await TicketUser.find({
          ticket: ticket._id,
          user: { $in: req.body.users },
        });
        eventEmitter.emit(
          ActivityType.REMOVE_USER_OUT_OF_TICKET,
          req.ticketId,
          {
            activeUser: { _id: req.data._id, name: req.data.name },
            user: deletedUsers,
            boardActive: req.board,
            clientId: req.headers.clientid,
            deleteUsersTicket: {
              users: deletedUsers.map((t) => ({ _id: String(t.user) })),
              ticketId: String(ticket._id),
            },
            ticketActive: ticket,
          }
        );
        await TicketUser.deleteMany({
          ticket: ticket._id,
          user: { $in: req.body.users },
        });
        res.status(200).json({ message: "Delete users successfully" });
      } else {
        res.status(404).json({
          message: "Ticket not found",
        });
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  getUsersTicket: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.ticketId);
      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }
      if (!(await checkUserAccessTicket(req.data, ticket))) {
        return res
          .status(403)
          .json({ message: "You are not allowed to access ticket" });
      }
      const users = await TicketUser.find({
        ticket: req.ticketId,
      })
        .populate({
          path: "user",
          select: "name email role",
          populate: {
            path: "avatar",
          },
        })
        .select("-_id -ticket")
        .exec();
      const state = await State.findById(ticket.state.toString());
      const boardsInvitedMembers = await getFullMembersOfBoard(
        state.board.toString()
      );
      const fullMembersOfBoard = Array.from(
        new Set([
          ...[...boardsInvitedMembers["invitedMembers"]],
          ...[...boardsInvitedMembers["usersInBoard"]],
        ])
      );
      const members = users.filter(
        (user) =>
          user.user && fullMembersOfBoard.includes(user.user._id.toString())
      );

      res.status(200).json({ ticket: ticket, users: members });
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
};

module.exports = ticketsUsersController;
