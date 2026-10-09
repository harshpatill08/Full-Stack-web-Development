const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");

// Step 10 & 11: Validate connection string
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI === "YOUR_MONGODB_CONNECTION_STRING") {
  console.error("Error: Please set your actual MONGODB_URI in server/.env before running student-crud.js");
  process.exit(1);
}

// Define Student Schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rollNo: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: true
  }
});

// Create Student Model
const Student = mongoose.model("Student", studentSchema);

// Perform CRUD Operations
async function runCRUD() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully!\n");

    // 1. CREATE: Create a new student record
    console.log("=== 1. CREATE OPERATION ===");
    const newStudent = await Student.create({
      name: "John Doe",
      rollNo: 101,
      department: "Computer Science"
    });
    console.log("Created Student Record:");
    console.log(newStudent);
    console.log("");

    // 2. READ: Display student records
    console.log("=== 2. READ OPERATION ===");
    const allStudents = await Student.find();
    console.log("Retrieved Student Records:");
    console.log(allStudents);
    console.log("");

    // 3. UPDATE: Update the student's department
    console.log("=== 3. UPDATE OPERATION ===");
    const updatedStudent = await Student.findByIdAndUpdate(
      newStudent._id,
      { department: "Information Technology" },
      { returnDocument: "after" }
    );
    console.log("Updated Student Record (Department updated to 'Information Technology'):");
    console.log(updatedStudent);
    console.log("");

    // 4. DELETE: Delete the sample student record
    console.log("=== 4. DELETE OPERATION ===");
    const deletedStudent = await Student.findByIdAndDelete(newStudent._id);
    console.log("Deleted Student Record:");
    console.log(deletedStudent);
    console.log("");

    console.log("CRUD demonstration completed successfully!");
  } catch (error) {
    console.error("Error executing CRUD operations:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
}

runCRUD();
