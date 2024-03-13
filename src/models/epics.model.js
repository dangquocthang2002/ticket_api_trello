const mongoose = require("mongoose");

const epicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
    description: {
      type: String,
    },
    startedDate: {
      type: Date,
    },
    endedDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["todo", "doing", "done", "archived"],
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let Epic = mongoose.model("Epic", epicSchema);
module.exports = Epic;
