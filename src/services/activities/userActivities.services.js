const Activity = require("../../models/activities.model");
const State = require("../../models/states.model");
const User = require("../../models/users.model");
const Ticket = require("../../models/tickets.model");
const Board = require("../../models/boards.model");

const modifyUserInTicketActivity = async (type, ticketId, data) => {
  try {
    const user = await User.findById(data.user[0].user);
    const ticket = await Ticket.findById(ticketId);
    const state = await State.findById(ticket.state);
    const newActivityTicket = new Activity({
      type: type,
      data: {
        activeUser: data.activeUser,
        object: { _id: user._id, name: user.name },
        parent: ticket.name,
      },
      board: state.board,
      ticket: ticketId,
    });
    await newActivityTicket.save();
  } catch (error) {
    console.log(error);
  }
};
const modifyUserInBoardActivity = async (type, boardId, data) => {
  const user = await User.findById(data.user[0].user);
  const board = await Board.findById(boardId);
  const newActivityTicket = new Activity({
    type: type,
    data: {
      activeUser: data.activeUser,
      object: { _id: user._id, name: user.name },
      parent: board.name,
    },
    board: boardId,
  });
  await newActivityTicket.save();
};

module.exports = { modifyUserInTicketActivity, modifyUserInBoardActivity };
