const labelAy = require("./labelActivities.services");
const stateAy = require("./stateActivities.services");
const userAy = require("./userActivities.services");
const ticketAy = require("./ticketActivities.services");
const taskAy = require("./taskActivities.services");

const Activities = {
  ...labelAy,
  ...stateAy,
  ...userAy,
  ...ticketAy,
  ...taskAy,
};
module.exports = Activities;
