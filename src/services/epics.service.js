const Epic = require("../models/epics.model");
const TicketModel = require("../models/tickets.model");

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

const findAllEpicsNotification = async () => {
  const epics = await Epic.find();
  const ticketsOfEpicsLate = await Promise.all(
    epics.map(async (epic) => {
      const tickets = await TicketModel.find({
        epic: epic._id,
      });
      const ticketsList = tickets
        .filter((t) => !t.private)
        .filter((t) => !t.isArchived);

      const tickestLate = ticketsList.filter(
        (ticket) => ticket.status != "done" && epic.endedDate < Date.now(),
      );

      const ticketsNeedStart = ticketsList.filter(
        (ticket) => ticket.status == "todo" && epic.startedDate < Date.now(),
      );
      return {
        ...epic._doc,
        ticketsLate: tickestLate,
        ticketsNeedStart: ticketsNeedStart,
      };
    }),
  );
  return ticketsOfEpicsLate;
};
module.exports = {
  isEpicExist,
  findAllEpicsNotification,
  isEpicObject,
  getBoardIdByEpic,
};
