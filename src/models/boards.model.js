const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    isArchived: {
      type: Boolean,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    viewOnly: {
      type: Boolean,
    },
    positionIndex: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

let Board = mongoose.model("Board", boardSchema);
module.exports = Board;
