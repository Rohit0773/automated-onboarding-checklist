const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Checklist = require("./models/Checklist");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const departmentTasks = {
  IT: [
    "Create company email account",
    "Set up laptop and development software",
    "Provide GitHub/GitLab access",
    "Configure VPN and security tools",
    "Complete IT security training"
  ],
  HR: [
    "Complete employee documentation",
    "Verify identity and bank details",
    "Explain company policies",
    "Complete HR orientation",
    "Collect emergency contact information"
  ],
  Finance: [
    "Complete finance department orientation",
    "Provide accounting system access",
    "Review financial policies",
    "Complete compliance training",
    "Assign finance mentor"
  ],
  Marketing: [
    "Create marketing tool accounts",
    "Provide brand guidelines",
    "Explain current campaigns",
    "Give social media access",
    "Assign marketing mentor"
  ],
  Sales: [
    "Create CRM account",
    "Explain sales process",
    "Provide product training",
    "Set up sales dashboard",
    "Assign sales mentor"
  ]
};

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Onboarding API is running" });
});

app.post("/api/checklists", async (req, res) => {
  try {
    const { name, employeeId, email, joiningDate, department } = req.body;

    if (!name || !employeeId || !email || !joiningDate || !department) {
      return res.status(400).json({ message: "All employee details are required." });
    }

    const taskTitles = departmentTasks[department] || [
      "Complete employee documentation",
      "Attend company orientation",
      "Set up required accounts",
      "Complete department training",
      "Meet assigned mentor"
    ];

    const tasks = taskTitles.map((title, index) => ({
      id: `${Date.now()}-${index}`,
      title,
      status: "Pending"
    }));

    const checklist = await Checklist.create({
      employee: { name, employeeId, email, joiningDate, department },
      tasks
    });

    res.status(201).json(checklist);
  } catch (error) {
    res.status(500).json({ message: "Failed to generate checklist.", error: error.message });
  }
});

app.get("/api/checklists", async (req, res) => {
  try {
    const checklists = await Checklist.find().sort({ createdAt: -1 });
    res.json(checklists);
  } catch (error) {
    res.status(500).json({ message: "Failed to load checklist history." });
  }
});

app.get("/api/checklists/:id", async (req, res) => {
  try {
    const checklist = await Checklist.findById(req.params.id);
    if (!checklist) return res.status(404).json({ message: "Checklist not found." });
    res.json(checklist);
  } catch (error) {
    res.status(500).json({ message: "Failed to load checklist." });
  }
});

app.patch("/api/checklists/:id/tasks/:taskId", async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Pending", "In Progress", "Completed"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid task status." });
    }

    const checklist = await Checklist.findById(req.params.id);
    if (!checklist) return res.status(404).json({ message: "Checklist not found." });

    const task = checklist.tasks.find((item) => item.id === req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found." });

    task.status = status;
    await checklist.save();

    res.json(checklist);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task status." });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
