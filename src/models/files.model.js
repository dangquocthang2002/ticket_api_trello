const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["used", "unused", "success", "failed"],
    },
  },
  {
    timestamps: true,
  }
);

let File = mongoose.model("File", fileSchema);
module.exports = File;
