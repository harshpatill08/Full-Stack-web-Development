const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", require("./auth"));

// Student schema
const studentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        rollNo: { type: Number, required: true, min: 0 },
        department: { type: String, required: true, trim: true },
        branch: { type: String, required: true, trim: true },
        year: { type: Number, required: true, min: 1 },
        age: { type: Number, required: true, min: 1 }
    },
    { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Student Management API is running",
        status: "OK"
    });
});

// Get all students
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch students" });
    }
});

// Get one student
app.get("/api/students/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid student ID" });
        }

        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch student" });
    }
});

// Create student
app.post("/api/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json({
            message: "Student created successfully",
            student
        });
    } catch (error) {
        res.status(400).json({
            message: "Unable to create student",
            error: error.message
        });
    }
});

// Update student
app.put("/api/students/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid student ID" });
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({
            message: "Student updated successfully",
            student
        });
    } catch (error) {
        res.status(400).json({
            message: "Unable to update student",
            error: error.message
        });
    }
});

// Delete student
app.delete("/api/students/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid student ID" });
        }

        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({
            message: "Student deleted successfully",
            student
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete student" });
    }
});

// Start server after connecting to MongoDB
const PORT = process.env.PORT || 5051;

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB successfully!");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    });