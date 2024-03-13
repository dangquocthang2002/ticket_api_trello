const mongoose = require("mongoose");

const ticketUserSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
  },
});

let TicketUser = mongoose.model("TicketUser", ticketUserSchema);
module.exports = TicketUser;
