const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending"
  }
});

const checklistSchema = new mongoose.Schema(
  {
    employee: {
      name: { type: String, required: true },
      employeeId: { type: String, required: true },
      email: { type: String, required: true },
      joiningDate: { type: String, required: true },
      department: { type: String, required: true }
    },
    tasks: [taskSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Checklist", checklistSchema);
