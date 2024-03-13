const { eventEmitter } = require("../eventEmitter.service");
const Activities = require("./index");
const { ActivityType } = require("./activity.constants");

//Ticket
eventEmitter.on(ActivityType.MOVE_TICKET_TO_COLUMN, async (data) => {
  await Activities.moveTicketActivity(ActivityType.MOVE_TICKET_TO_COLUMN, data);
});
eventEmitter.on(ActivityType.CREATE_NEW_TICKET, async (data) => {
  await Activities.addOrDeleteTicketActivity(
    ActivityType.CREATE_NEW_TICKET,
    data
  );
});
eventEmitter.on(ActivityType.DELETE_TICKET, async (data) => {
  await Activities.addOrDeleteTicketActivity(ActivityType.DELETE_TICKET, data);
});
eventEmitter.on(ActivityType.UPDATE_TITLE_TICKET, async (data) => {
  await Activities.updateTicketTitleActivity(
    ActivityType.UPDATE_TITLE_TICKET,
    data
  );
});
eventEmitter.on(ActivityType.ARCHIVE_TICKET, async (data) => {
  await Activities.archiveOrRestoreTicketActivity(
    ActivityType.ARCHIVE_TICKET,
    data
  );
});
eventEmitter.on(ActivityType.RESTORE_TICKET, async (data) => {
  await Activities.archiveOrRestoreTicketActivity(
    ActivityType.RESTORE_TICKET,
    data
  );
});

//State
eventEmitter.on(ActivityType.MOVE_STATE_POSITION, async (data) => {
  await Activities.moveStateActivity(ActivityType.MOVE_STATE_POSITION, data);
});
eventEmitter.on(ActivityType.ADD_STATE, async (data) => {
  await Activities.addOrDeleteStateActivity(ActivityType.ADD_STATE, data);
});
eventEmitter.on(ActivityType.DELETE_STATE, async (data) => {
  await Activities.addOrDeleteStateActivity(type, data);
});
eventEmitter.on(ActivityType.UPDATE_STATE_TITLE, async (data) => {
  await Activities.updateStateTitleActivity(
    ActivityType.UPDATE_STATE_TITLE,
    data
  );
});
eventEmitter.on(ActivityType.ARCHIVE_STATE, async (data) => {
  await Activities.archiveOrRestoreStateActivity(
    ActivityType.ARCHIVE_STATE,
    data
  );
});
eventEmitter.on(ActivityType.RESTORE_STATE, async (data) => {
  await Activities.archiveOrRestoreStateActivity(
    ActivityType.RESTORE_STATE,
    data
  );
});

//Label
eventEmitter.on(ActivityType.USER_CREATE_LABEL_TO_BOARD, async (data) => {
  await Activities.createOrDeleteLabelActivity(
    ActivityType.USER_CREATE_LABEL_TO_BOARD,
    data
  );
});
eventEmitter.on(ActivityType.USER_DELETE_LABEL_OF_BOARD, async (data) => {
  await Activities.createOrDeleteLabelActivity(
    ActivityType.USER_DELETE_LABEL_OF_BOARD,
    data
  );
});
eventEmitter.on(ActivityType.USER_UPDATE_LABEL_INFO, async (data) => {
  await Activities.updateLabelTitleActivity(
    ActivityType.USER_UPDATE_LABEL_INFO,
    data
  );
});
eventEmitter.on(ActivityType.USER_ADD_LABEL_TO_TICKET, async (data) => {
  await Activities.assignLabelToTicketActivity(
    ActivityType.USER_ADD_LABEL_TO_TICKET,
    data
  );
});
eventEmitter.on(ActivityType.USER_REMOVE_LABEL_OF_TICKET, async (data) => {
  await Activities.assignLabelToTicketActivity(
    ActivityType.USER_REMOVE_LABEL_OF_TICKET,
    data
  );
});

//User
eventEmitter.on(ActivityType.ADD_USER_TO_BOARD, async (boardId, data) => {
  await Activities.modifyUserInBoardActivity(
    ActivityType.ADD_USER_TO_BOARD,
    boardId,
    data
  );
});
eventEmitter.on(
  ActivityType.REMOVE_USER_OUT_OF_BOARD,
  async (boardId, data) => {
    await Activities.modifyUserInBoardActivity(
      ActivityType.REMOVE_USER_OUT_OF_BOARD,
      boardId,
      data
    );
  }
);
eventEmitter.on(ActivityType.ADD_USER_TO_TICKET, async (ticketId, data) => {
  await Activities.modifyUserInTicketActivity(
    ActivityType.ADD_USER_TO_TICKET,
    ticketId,
    data
  );
});
eventEmitter.on(
  ActivityType.REMOVE_USER_OUT_OF_TICKET,
  async (ticketId, data) => {
    await Activities.modifyUserInTicketActivity(
      ActivityType.REMOVE_USER_OUT_OF_TICKET,
      ticketId,
      data
    );
  }
);

//Task
eventEmitter.on(ActivityType.USER_ADD_TASK_TO_TICKET, async (data) => {
  await Activities.createOrDeleteTaskActivity(
    ActivityType.USER_ADD_TASK_TO_TICKET,
    data
  );
});
eventEmitter.on(ActivityType.USER_DELETE_TASK, async (data) => {
  await Activities.createOrDeleteTaskActivity(
    ActivityType.USER_DELETE_TASK,
    data
  );
});

eventEmitter.on(ActivityType.USER_CHANGE_TASK_TITLE, async (data) => {
  await Activities.updateTaskTitleActivity(ActivityType.USER_CHANGE_TASK_TITLE, data);
});

eventEmitter.on(ActivityType.USER_COMPLETED_TASK, async (data) => {
  await Activities.updateTaskProgressActivity(
    ActivityType.USER_COMPLETED_TASK,
    data
  );
});
eventEmitter.on(ActivityType.USER_UN_COMPLETED_TASK, async (data) => {
  await Activities.updateTaskProgressActivity(
    ActivityType.USER_UN_COMPLETED_TASK,
    data
  );
});
