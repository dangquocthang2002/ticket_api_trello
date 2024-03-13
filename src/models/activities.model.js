const mongoose = require("mongoose");

const activitiesSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    timestamps: true,
  }
);

let Activity = mongoose.model("Activitiy", activitiesSchema);
module.exports = Activity;
