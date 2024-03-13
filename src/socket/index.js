const { Sockets } = require("./namespaces");

module.exports = (io) => {
  Sockets(io, io.of("/boards"));
};
