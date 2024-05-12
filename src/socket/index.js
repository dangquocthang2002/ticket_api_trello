const { SocketsBoards, SocketsNotification } = require("./namespaces");

module.exports = (io) => {
  SocketsBoards(io, io.of("/boards"));
  SocketsNotification(io, io.of("/notifications"));
};
