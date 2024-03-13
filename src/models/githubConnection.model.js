const mongoose = require("mongoose");
const githubConnectionSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    accessToken: {
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
let GithubConnection = mongoose.model(
  "GithubConnection",
  githubConnectionSchema
);
module.exports = GithubConnection;
