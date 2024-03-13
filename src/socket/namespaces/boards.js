const { verifyToken } = require("../../utils/jwt.util");

const {
  ActivityType,
} = require("../../services/activities/activity.constants");
const { eventEmitter } = require("../../services/eventEmitter.service");
function BoardSocket(io, namespace) {
  let allSockets = [];
  const joinBoard = (socket, boardId) => {
    socket.join(boardId);
  };
  const listenSocketEvents = (socket) => {
    socket.on("boardActive", (board) => {
      if (board._id) {
        allSockets.push({
          socketId: socket.id,
          boardId: board._id,
        });
        joinBoard(socket, board._id);
      } else {
        throw new Error("board not found");
      }
    });
  };
  namespace.on("connection", (socket) => {
    console.log(socket.id + " is connected");
    const userActive = verifyToken(socket.handshake.query.token);
    if (userActive) {
      listenSocketEvents(socket);
      socket.on("disconnect", () => {
        try {
          let index = -1;
          socket.leave(
            allSockets.find((s, i) => {
              index = i;
              return s.socketId === socket.id;
            }).boardId
          );
          if (index > -1) {
            allSockets.splice(index, 1);
          }
        } catch (error) {
          console.log("[error]", "leave room :", error);
        }
        console.log(socket.id + " disconnected");
      });
    } else {
      socket.disconnect();
      console.log(socket.id, " user have to login");
    }
  });

  // board actions -------------------------------------------------
  eventEmitter.on(ActivityType.ADD_USER_TO_BOARD, (boardId, data) => {
    console.log(data.newUsers);
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.ADD_USER_TO_BOARD, {
        newUsers: data.newUsers,
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
      });
  });
  eventEmitter.on(ActivityType.REMOVE_USER_OUT_OF_BOARD, (boardId, data) => {
    console.log(data.newUsers);
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.REMOVE_USER_OUT_OF_BOARD, {
        usersDelete: data.usersDelete,
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
      });
  });

  eventEmitter.on(ActivityType.ADD_EPIC_TO_BOARD, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.ADD_EPIC_TO_BOARD, {
        newEpic: data.newEpic,
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
      });
  });
  eventEmitter.on(ActivityType.UPDATE_EPIC_IN_BOARD, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.UPDATE_EPIC_IN_BOARD, {
        epicUpdate: data.epicUpdate,
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
      });
  });
  eventEmitter.on(ActivityType.DELETE_EPIC_FROM_BOARD, (data) => {
    namespace
      .to(String(data.boardIdActive))
      .emit(ActivityType.DELETE_EPIC_FROM_BOARD, {
        epicDelete: data.epicDelete,
        clientId: data.clientId,
        boardIdActive: data.boardIdActive,
      });
  });
  // ticket actions --------------------------------

  // create new ticket
  eventEmitter.on(ActivityType.CREATE_NEW_TICKET, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.CREATE_NEW_TICKET, {
        newTicket: data.ticket,
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
      });
  });

  // update ticket DETAILS
  eventEmitter.on(ActivityType.UPDATE_TICKET_DETAILS, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.UPDATE_TICKET_DETAILS, {
        ticketUpdate: data.ticketUpdate,
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
      });
  });

  // archived ticket
  eventEmitter.on(ActivityType.ARCHIVE_TICKET, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.ARCHIVE_TICKET, {
        ticketArchive: data.ticketArchive,
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
      });
  });

  // restore ticket
  eventEmitter.on(ActivityType.RESTORE_TICKET, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.RESTORE_TICKET, {
        ticketRestore: data.ticketRestore,
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
      });
  });

  // move ticket
  eventEmitter.on(ActivityType.MOVE_TICKET, (data) => {
    namespace.to(String(data.boardActive._id)).emit(ActivityType.MOVE_TICKET, {
      ticketMove: data.ticketMove,
      clientId: data.clientId,
      fromStateId: data.fromStateId,
      toStateId: data.toStateId,
      boardIdActive: data.boardActive._id,
    });
  });

  eventEmitter.on(ActivityType.ADD_USER_TO_TICKET, (ticketId, data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.ADD_USER_TO_TICKET, {
        newUsersTicket: data.newUsersTicket,
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
        ticketActive: data.ticketActive,
      });
  });

  eventEmitter.on(ActivityType.REMOVE_USER_OUT_OF_TICKET, (ticketId, data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.REMOVE_USER_OUT_OF_TICKET, {
        deleteUsersTicket: data.deleteUsersTicket,
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
        ticketActive: data.ticketActive,
      });
  });
  eventEmitter.on(ActivityType.USER_ADD_LABEL_TO_TICKET, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.USER_ADD_LABEL_TO_TICKET, {
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
        newTicketLabel: data.newTicketLabel,
        ticketId: data.ticketId,
        ticketActive: data.ticketActive,
      });
  });
  eventEmitter.on(ActivityType.USER_REMOVE_LABEL_OF_TICKET, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.USER_REMOVE_LABEL_OF_TICKET, {
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
        ticketLabelId: data.ticketLabelId,
        ticketId: data.ticketId,
        ticketActive: data.ticketActive,
      });
  });

  // ticketFiles actions ---------------------------------------------------------
  eventEmitter.on(ActivityType.USER_ADD_FILE_TO_TICKET, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.USER_ADD_FILE_TO_TICKET, {
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
        newFiles: data.newFiles,
        ticketId: data.ticketId,
        ticketActive: data.ticketActive,
      });
  });
  eventEmitter.on(ActivityType.USER_UPDATE_FILE_IN_TICKET, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.USER_UPDATE_FILE_IN_TICKET, {
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
        fileUpdate: data.fileUpdate,
        ticketId: data.ticketId,
        ticketActive: data.ticketActive,
      });
  });
  eventEmitter.on(ActivityType.USER_DELETE_FILE_FROM_TICKET, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.USER_DELETE_FILE_FROM_TICKET, {
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
        fileId: data.fileId,
        ticketId: data.ticketId,
        ticketActive: data.ticketActive,
      });
  });

  // ticket tasks events -------------------------------------------
  eventEmitter.on(ActivityType.USER_ADD_TASK_TO_TICKET, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.USER_ADD_TASK_TO_TICKET, {
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
        newTask: data.task,
        ticketId: data.ticketId,
        ticketActive: data.ticketActive,
      });
  });
  eventEmitter.on(ActivityType.USER_UPDATE_TASK, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.USER_UPDATE_TASK, {
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
        taskUpdate: data.taskUpdate,
        ticketId: data.ticketId,
        ticketActive: data.ticketActive,
      });
  });
  eventEmitter.on(ActivityType.USER_DELETE_TASK, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.USER_DELETE_TASK, {
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
        taskId: data.taskId,
        ticketId: data.ticketId,
        ticketActive: data.ticketActive,
      });
  });
  //state events------------------------------------------
  eventEmitter.on(ActivityType.ADD_STATE, (data) => {
    namespace.to(String(data.boardActive._id)).emit(ActivityType.ADD_STATE, {
      newState: data.state,
      clientId: data.clientId,
      boardIdActive: data.boardActive._id,
    });
  });
  eventEmitter.on(ActivityType.UPDATE_STATE_TITLE, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.UPDATE_STATE_TITLE, {
        stateUpdate: data.stateUpdate,
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
      });
  });
  eventEmitter.on(ActivityType.MAKE_DONE_STATE, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.MAKE_DONE_STATE, {
        stateUpdate: data.stateUpdate,
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
      });
  });
  eventEmitter.on(ActivityType.MOVE_STATE_POSITION, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.MOVE_STATE_POSITION, {
        stateUpdate: data.stateUpdate,
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
      });
  });
  eventEmitter.on(ActivityType.ARCHIVE_STATE, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.ARCHIVE_STATE, {
        stateArchive: data.stateArchive,
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
      });
  });
  eventEmitter.on(ActivityType.RESTORE_STATE, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.RESTORE_STATE, {
        stateRestore: data.stateRestore,
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
      });
  });

  // label actions ------------------------------------------------
  eventEmitter.on(ActivityType.USER_CREATE_LABEL_TO_BOARD, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.USER_CREATE_LABEL_TO_BOARD, {
        newLabel: data.label,
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
      });
  });
  eventEmitter.on(ActivityType.USER_UPDATE_LABEL_INFO, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.USER_UPDATE_LABEL_INFO, {
        labelUpdate: data.labelUpdate,
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
      });
  });
  eventEmitter.on(ActivityType.USER_DELETE_LABEL_OF_BOARD, (data) => {
    namespace
      .to(String(data.boardActive._id))
      .emit(ActivityType.USER_DELETE_LABEL_OF_BOARD, {
        labelDelete: data.label,
        ticketIdDeleteLabel: data.ticketIdDeleteLabel,
        clientId: data.clientId,
        boardIdActive: data.boardActive._id,
      });
  });
}
module.exports = BoardSocket;
