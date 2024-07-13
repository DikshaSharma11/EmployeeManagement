const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
