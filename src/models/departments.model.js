const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    positionIndex: {
      type: Number,
    },
    description: {
      type: String,
    },
    isArchived: {
      type: Boolean,
    },
 
  },
  {
    timestamps: true,
  }
);

let Department = mongoose.model("Department", departmentSchema);
module.exports = Department;
