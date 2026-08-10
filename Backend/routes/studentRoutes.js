const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");

// Add Student
router.post("/add", studentController.addStudent);

// Get All Students
router.get("/", studentController.getStudents);

// Update Student
router.put("/:id", studentController.updateStudent);

// Delete Student
router.delete("/:id", studentController.deleteStudent);

module.exports = router;