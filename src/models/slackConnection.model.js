const mongoose = require("mongoose");
const slackConnectionSchema = new mongoose.Schema(
  {
    channel: {
      type: String,
    },
    botToken: {
      type: String,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
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
let SlackConnection = mongoose.model("SlackConnection", slackConnectionSchema);
module.exports = SlackConnection;
