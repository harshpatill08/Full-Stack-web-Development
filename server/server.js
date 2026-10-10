const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", require("./auth"));

// Student Schema & Model
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    rollNo: Number,
    department: String,
    branch: String,
    year: Number,
    age: Number
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "API server ready",
    status: "OK"
  });
});

// GET all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET one student
app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// CREATE student
app.post("/api/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE student
app.put("/api/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE student
app.delete("/api/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({
      message: "Student deleted successfully",
      deletedStudent
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Connect to MongoDB before starting the server
async function startServer() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing from environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully!");

    const PORT = process.env.PORT || 5050;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log("API server ready");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();