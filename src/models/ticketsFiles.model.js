const mongoose = require("mongoose");

const ticketFileSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isCovered: {
    type: Boolean,
  },
});

let TicketFile = mongoose.model("TicketFile", ticketFileSchema);
module.exports = TicketFile;
