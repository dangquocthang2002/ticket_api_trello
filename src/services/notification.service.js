const Notification = require("../models/notification.model");
const TicketUser = require("../models/ticketsUsers.model");
const { ActivityType } = require("./activities/activity.constants");
const { findAllEpicsNotification } = require("./epics.service");
const { eventEmitter } = require("./eventEmitter.service");

const createNotification = async () => {
  const newNotification = new Notification({
    content: "test",
    type: "LATE",
    fromId: "66169e7ee598c303b0fffa9f",
    toId: "66169e7ee598c303b0fffaa0",
  });
  newNotification.save();
};

const checkAndCreateNotification = async () => {
  const value = await findAllEpicsNotification();
  const listNotificationArray = await Promise.all(
    value.map(async (epic) => {
      const resultLate = await Promise.all(
        epic.ticketsLate.map(async (ticket) => {
          const ticketUserLate = await TicketUser.find({
            ticket: ticket._id,
          });
          const listNotificationLate = [];
          ticketUserLate.forEach((ticketUser) =>
            listNotificationLate.push(
              new Notification({
                content: `Your ticket ${ticket.name} is late`,
                type: "LATE",
                fromId: epic.board,
                toId: ticketUser.user,
              }),
            ),
          );
          return listNotificationLate;
        }),
      );
      const resultNeedStart = await Promise.all(
        epic.ticketsNeedStart.map(async (ticket) => {
          const ticketNeedStart = await TicketUser.find({
            ticket: ticket._id,
          });
          const listNotificationNeedStart = [];
          ticketNeedStart.forEach((ticketUser) =>
            listNotificationNeedStart.push(
              new Notification({
                content: `Your ticket ${ticket.name} need start`,
                type: "START",
                fromId: epic.board,
                toId: ticketUser.user,
              }),
            ),
          );
          return listNotificationNeedStart;
        }),
      );

      return [
        ...resultLate.reduce((acc, curr) => acc.concat(curr), []),
        ...resultNeedStart.reduce((acc, curr) => acc.concat(curr), []),
      ];
    }),
  );
  const listNotification = listNotificationArray.reduce(
    (acc, curr) => acc.concat(curr),
    [],
  );

  listNotification.forEach(async (notification) => {
    await notification.save();
    eventEmitter.emit(ActivityType.ADD_NEW_NOTIFICATION, {
      activeUser: { _id: notification.to_id },
      notification: notification,
    });
  });
  console.log("send notification");
};

module.exports = {
  createNotification,
  checkAndCreateNotification,
};
