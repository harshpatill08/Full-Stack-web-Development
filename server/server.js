const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/college";

// Middleware
app.use(cors());
app.use(express.json());

// Student Schema & Model
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rollNo: {
    type: Number
  },
  department: {
    type: String
  },
  branch: {
    type: String
  },
  year: {
    type: Number
  },
  age: {
    type: Number
  }
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "API server ready", status: "OK" });
});

// GET /api/students - Read all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/students/:id - Read a single student
app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/students - Create a student
app.post("/api/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/students/:id - Update a student
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

// DELETE /api/students/:id - Delete a student
app.delete("/api/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully", deletedStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Connect to MongoDB and start the server
async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully!");

    const server = app.listen(PORT, "127.0.0.1", () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log("API server ready");
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`Port ${PORT} in use, trying port 5001...`);
        app.listen(5001, "127.0.0.1", () => {
          console.log("Server running at http://localhost:5001");
          console.log("API server ready");
        });
      } else {
        console.error("Server error:", err);
      }
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();
