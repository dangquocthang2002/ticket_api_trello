const { bool, boolean } = require("joi");
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    private: {
      type: Boolean,
    },
    description: {
      type: mongoose.Schema.Types.Mixed,
    },
    startedDate: {
      type: Date,
    },
    endedDate: {
      type: Date,
    },
    movedAt: {
      type: Date,
    },
    createdBy: {
      type: String,
    },
    isArchived: {
      type: Boolean,
    },
    estimatePoints: {
      type: Number,
    },
    positionIndex: {
      type: Number,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    epic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Epic",
    },
  },
  {
    timestamps: true,
  }
);

let Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
