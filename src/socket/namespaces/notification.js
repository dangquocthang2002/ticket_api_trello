const { verifyToken } = require("../../utils/jwt.util");
const { eventEmitter } = require("../../services/eventEmitter.service");
const {
  ActivityType,
} = require("../../services/activities/activity.constants");

function NotificationSocket(io, namespace) {
  let allSockets = [];
  const addUserOnline = (socket, userId) => {
    socket.join(userId);
  };
  const listenSocketEvents = (socket) => {
    socket.on("addUserOnline", (user) => {
      if (user._id) {
        allSockets.push({
          socketId: socket.id,
          userId: user._id,
        });
        addUserOnline(socket, user._id);
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
  eventEmitter.on(ActivityType.ADD_NEW_NOTIFICATION, (userId, data) => {
    namespace.to(String(userId)).emit(ActivityType.ADD_NEW_NOTIFICATION, {
      notification: data.notification,
    });
  });
}

module.exports = NotificationSocket;
