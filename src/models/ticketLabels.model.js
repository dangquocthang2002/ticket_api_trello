const mongoose = require("mongoose");

const ticketLabelsSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
  },
  label: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Label",
  },
});

let TicketLabels = mongoose.model("TicketLabels", ticketLabelsSchema);
module.exports = TicketLabels;