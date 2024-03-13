const ticketConnections = require("./ticketConnections.services");
const stateConnections = require("./stateConnections.services");
const labelConnections = require("./labelConnections.services");
const userConnections = require("./userConnections.services");
const tasksConnections = require("./taskConnections.services");
const Connections = {
  ...ticketConnections,
  ...stateConnections,
  ...labelConnections,
  ...userConnections,
  ...tasksConnections,
};
module.exports = Connections;
