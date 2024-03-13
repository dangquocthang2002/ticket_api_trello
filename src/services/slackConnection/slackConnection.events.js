const { eventEmitter } = require("../eventEmitter.service");
const Connections = require("./index");
const { ActivityType } = require("../activities/activity.constants");

const handleError = (err) => {
  console.log("SLACK CONNECTION ERROR", err);
};

//Ticket
eventEmitter.on(ActivityType.MOVE_TICKET_TO_COLUMN, async (data) => {
  await Connections.moveTicketConnection(
    ActivityType.MOVE_TICKET_TO_COLUMN,
    data
  ).catch(handleError);
});
eventEmitter.on(ActivityType.CREATE_NEW_TICKET, async (data) => {
  await Connections.addTicketConnection(
    ActivityType.CREATE_NEW_TICKET,
    data
  ).catch(handleError);
});
eventEmitter.on(ActivityType.DELETE_TICKET, async (data) => {
  await Connections.deleteTicketConnection(
    ActivityType.DELETE_TICKET,
    data
  ).catch(handleError);
});
eventEmitter.on(ActivityType.UPDATE_TITLE_TICKET, async (data) => {
  await Connections.updateTicketTitleConnection(
    ActivityType.UPDATE_TITLE_TICKET,
    data
  ).catch(handleError);
});
eventEmitter.on(ActivityType.ARCHIVE_TICKET, async (data) => {
  await Connections.archiveTicketConnection(
    ActivityType.ARCHIVE_TICKET,
    data
  ).catch(handleError);
});
eventEmitter.on(ActivityType.RESTORE_TICKET, async (data) => {
  await Connections.restoreTicketConnection(
    ActivityType.RESTORE_TICKET,
    data
  ).catch(handleError);
});

//State
eventEmitter.on(ActivityType.MOVE_STATE_POSITION, async (data) => {
  await Connections.moveStateConnection(
    ActivityType.MOVE_STATE_POSITION,
    data
  ).catch(handleError);
});
eventEmitter.on(ActivityType.ADD_STATE, async (data) => {
  await Connections.addStateConnection(ActivityType.ADD_STATE, data).catch(
    handleError
  );
});
eventEmitter.on(ActivityType.DELETE_STATE, async (data) => {
  await Connections.deleteStateConnection(
    ActivityType.DELETE_STATE,
    data
  ).catch(handleError);
});
eventEmitter.on(ActivityType.UPDATE_STATE_TITLE, async (data) => {
  await Connections.updateStateTitleConnection(
    ActivityType.UPDATE_STATE_TITLE,
    data
  ).catch(handleError);
});
eventEmitter.on(ActivityType.ARCHIVE_STATE, async (data) => {
  await Connections.archiveStateConnection(
    ActivityType.ARCHIVE_STATE,
    data
  ).catch(handleError);
});
eventEmitter.on(ActivityType.RESTORE_STATE, async (data) => {
  await Connections.restoreStateConnection(
    ActivityType.RESTORE_STATE,
    data
  ).catch(handleError);
});

//Label
eventEmitter.on(ActivityType.USER_CREATE_LABEL_TO_BOARD, async (data) => {
  await Connections.createLabelConnection(
    ActivityType.USER_CREATE_LABEL_TO_BOARD,
    data
  ).catch(handleError);
});
eventEmitter.on(ActivityType.USER_DELETE_LABEL_OF_BOARD, async (data) => {
  await Connections.deleteLabelConnection(
    ActivityType.USER_DELETE_LABEL_OF_BOARD,
    data
  ).catch(handleError);
});
eventEmitter.on(ActivityType.USER_UPDATE_LABEL_INFO, async (data) => {
  await Connections.updateLabelConnection(
    ActivityType.USER_UPDATE_LABEL_INFO,
    data
  ).catch(handleError);
});
eventEmitter.on(ActivityType.USER_ADD_LABEL_TO_TICKET, async (data) => {
  await Connections.assignLabelToTicketConnection(
    ActivityType.USER_ADD_LABEL_TO_TICKET,
    data
  ).catch(handleError);
});
eventEmitter.on(ActivityType.USER_REMOVE_LABEL_OF_TICKET, async (data) => {
  await Connections.removeLabelOutOfTicketConnection(
    ActivityType.USER_REMOVE_LABEL_OF_TICKET,
    data
  ).catch(handleError);
});

//User
eventEmitter.on(ActivityType.ADD_USER_TO_BOARD, async (boardId, data) => {
  await Connections.addUserToBoardConnection(
    ActivityType.ADD_USER_TO_BOARD,
    boardId,
    data
  ).catch(handleError);
});
eventEmitter.on(
  ActivityType.REMOVE_USER_OUT_OF_BOARD,
  async (boardId, data) => {
    ActivityType.REMOVE_USER_OUT_OF_BOARD,
      await Connections.removeUserOutOfBoardConnection(boardId, data).catch(
        handleError
      );
  }
);
eventEmitter.on(ActivityType.ADD_USER_TO_TICKET, async (ticketId, data) => {
  await Connections.addUserToTicketConnection(
    ActivityType.ADD_USER_TO_TICKET,
    ticketId,
    data
  ).catch(handleError);
});
eventEmitter.on(
  ActivityType.REMOVE_USER_OUT_OF_TICKET,
  async (ticketId, data) => {
    await Connections.removeUserOutOfTicketConnection(
      ActivityType.REMOVE_USER_OUT_OF_TICKET,
      ticketId,
      data
    ).catch(handleError);
  }
);

//Task
eventEmitter.on(ActivityType.USER_ADD_TASK_TO_TICKET, async (data) => {
  await Connections.createTaskConnection(
    ActivityType.USER_ADD_TASK_TO_TICKET,
    data
  ).catch(handleError);
});
eventEmitter.on(ActivityType.USER_DELETE_TASK, async (data) => {
  await Connections.deleteTaskConnection(
    ActivityType.USER_DELETE_TASK,
    data
  ).catch(handleError);
});
eventEmitter.on(ActivityType.USER_CHANGE_TASK_TITLE, async (data) => {
  await Connections.updateTaskTitleConnection(
    ActivityType.USER_CHANGE_TASK_TITLE,
    data
  ).catch(handleError);
});
eventEmitter.on(ActivityType.USER_COMPLETED_TASK, async (data) => {
  await Connections.userCompletedTaskConnection(
    ActivityType.USER_COMPLETED_TASK,
    data
  ).catch(handleError);
});
eventEmitter.on(ActivityType.USER_UN_COMPLETED_TASK, async (data) => {
  await Connections.userUncompletedTaskConnection(
    ActivityType.USER_UN_COMPLETED_TASK,
    data
  ).catch(handleError);
});
