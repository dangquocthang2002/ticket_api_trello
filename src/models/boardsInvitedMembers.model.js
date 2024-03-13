const mongoose = require("mongoose");

const boardInvitedMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
    },
  },
  {
    timestamps: true,
  }
);

let BoardInvitedMember = mongoose.model(
  "BoardInvitedMember",
  boardInvitedMemberSchema
);
module.exports = BoardInvitedMember;
