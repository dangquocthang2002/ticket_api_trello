const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    positionIndex: {
      type: Number,
    },
    isArchived: {
      type: Boolean,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    isInProgress: {
      type: Boolean,
      default: false,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

let State = mongoose.model("State", stateSchema);
module.exports = State;
