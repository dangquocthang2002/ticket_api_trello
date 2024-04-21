const { unArchivedConditions } = require("../constants/constants");
const Ticket = require("../models/tickets.model");
const TicketUser = require("../models/ticketsUsers.model");
const TicketLabels = require("../models/ticketLabels.model");
const TicketFiles = require("../models/ticketsFiles.model");
const Task = require("../models/tasks.model");

const isTicketExist = async (value) => {
  const ticket = await Ticket.findById(value);
  if (ticket || !value) {
    return value;
  } else {
    throw new Error("Board not found!");
  }
};
const checkUsersNotInTicket = async (userIds, ticket) => {
  const existedUser = await TicketUser.find({
    user: { $in: userIds },
    ticket: ticket._id,
  });
  return userIds.filter(
    (userId) =>
      !existedUser.map((user) => user.user.toString()).includes(userId),
  );
};
const deleteTicketByUserId = async (userId) => {
  await TicketUser.deleteMany({
    user: userId,
  });
};
const deleteTicketFilesByUserId = async (userId) => {
  await TicketFiles.deleteMany({
    user: userId,
  });
};
const checkUserAccessTicket = async (user, ticket) => {
  if (user.role === "ADMIN") {
    return true;
  }
  if (!ticket.private) {
    return true;
  }
  const existedUser = await TicketUser.findOne({
    user: user._id,
    ticket: ticket._id,
  });
  return existedUser ? true : false;
};
const getUnarchivedTickets = (condition) => {
  return Ticket.find({
    ...condition,
    $or: unArchivedConditions,
  });
};
const getDetailTicket = async (ticketId) => {
  try {
    const ticket = await Ticket.findById(ticketId);
    const { ticketLabels, ticketFiles, ticketUsers, tasksInTicket } =
      await Promise.all([
        TicketLabels.find({ ticket: ticket._id }),
        TicketFiles.find({ ticket: ticket._id }).populate({
          path: "file",
        }),
        TicketUser.find({ ticket: ticket._id }).populate({
          path: "user",
        }),
        Task.find({ ticket: ticket._id }),
      ]).then((res) => ({
        ticketLabels: res[0],
        ticketFiles: res[1],
        ticketUsers: res[2].filter((item) => item.user),
        tasksInTicket: res[3],
      }));

    return {
      ...ticket._doc,
      labels: ticketLabels || [],
      members: ticketUsers?.map((item) => item.user) || [],
      attachments: ticketFiles?.map((item) => item.file) || [],
      tasks: tasksInTicket || [],
    };
  } catch (error) {
    throw new Error("Something went wrong!");
  }
};
module.exports = {
  getUnarchivedTickets,
  isTicketExist,
  checkUsersNotInTicket,
  checkUserAccessTicket,
  deleteTicketFilesByUserId,
  deleteTicketByUserId,
  getDetailTicket,
};
