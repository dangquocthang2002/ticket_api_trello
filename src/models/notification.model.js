const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    fromId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    toId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["LATE", "START", "NORMAL"],
      default: "USER",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

let Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
