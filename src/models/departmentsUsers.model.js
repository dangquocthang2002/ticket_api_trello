const mongoose = require("mongoose");

const departmentUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
});

let departmentUser = mongoose.model("DepartmentUser", departmentUserSchema);
module.exports = departmentUser;
